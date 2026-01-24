/**
 * Custom error types and error handling utilities
 * Provides consistent error handling across the application
 */

// ============================================================================
// CUSTOM ERROR TYPES
// ============================================================================

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/**
 * Validation error for form inputs
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

/**
 * Network error for API failures
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    public originalError?: Error,
    public isOffline: boolean = false
  ) {
    super(message, "NETWORK_ERROR", isOffline ? 503 : 500);
    this.name = "NetworkError";
  }
}

/**
 * Authentication error for auth-related failures
 */
export class AuthError extends AppError {
  constructor(
    message: string,
    public reason?: "unauthorized" | "forbidden" | "session_expired"
  ) {
    super(message, "AUTH_ERROR", reason === "forbidden" ? 403 : 401);
    this.name = "AuthError";
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict error for duplicate or conflicting data
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}

// ============================================================================
// ERROR PARSING
// ============================================================================

/**
 * Parse an unknown error into a known AppError type
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Network error from fetch/axios-like
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new NetworkError(
      "Network connection failed. Please check your internet connection.",
      error as Error,
      true
    );
  }

  // Network error with status code (from Convex)
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof (error as any).status === "number"
  ) {
    const status = (error as any).status;
    if (status >= 500) {
      return new NetworkError(
        "Server error. Please try again later.",
        error instanceof Error ? error : new Error(String(error))
      );
    } else if (status === 401 || status === 403) {
      return new AuthError(
        "Authentication failed. Please log in again.",
        status === 403 ? "forbidden" : "unauthorized"
      );
    } else if (status === 404) {
      return new NotFoundError();
    } else if (status === 409) {
      return new ConflictError("This action conflicts with existing data.");
    }
  }

  // Convex-specific errors
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    typeof (error as any).data === "object"
  ) {
    const data = (error as any).data;
    if (data.message) {
      // Check for validation-like errors in the message
      const message = String(data.message);
      if (
        message.toLowerCase().includes("validation") ||
        message.toLowerCase().includes("required") ||
        message.toLowerCase().includes("invalid")
      ) {
        return new ValidationError(message);
      }
      return new AppError(message);
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(error.message);
  }

  // String error
  if (typeof error === "string") {
    return new AppError(error);
  }

  // Unknown error type
  return new AppError("An unexpected error occurred");
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Get a user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  // Network errors
  if (error instanceof NetworkError) {
    if (error.isOffline) {
      return "You appear to be offline. Please check your internet connection.";
    }
    return "Unable to connect to the server. Please try again.";
  }

  // Auth errors
  if (error instanceof AuthError) {
    switch (error.reason) {
      case "unauthorized":
        return "You need to log in to perform this action.";
      case "forbidden":
        return "You don't have permission to perform this action.";
      case "session_expired":
        return "Your session has expired. Please log in again.";
      default:
        return "Authentication failed. Please try again.";
    }
  }

  // Validation errors
  if (error instanceof ValidationError) {
    return error.message;
  }

  // Not found errors
  if (error instanceof NotFoundError) {
    return error.message;
  }

  // Conflict errors
  if (error instanceof ConflictError) {
    return error.message;
  }

  // Default error message
  return error.message || "Something went wrong. Please try again.";
}

/**
 * Get a toast title based on error type
 */
export function getErrorTitle(error: AppError): string {
  if (error instanceof ValidationError) return "Validation Error";
  if (error instanceof NetworkError) return "Network Error";
  if (error instanceof AuthError) return "Authentication Error";
  if (error instanceof NotFoundError) return "Not Found";
  if (error instanceof ConflictError) return "Conflict";
  return "Error";
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Error log entry
 */
interface ErrorLog {
  timestamp: string;
  errorType: string;
  code: string | undefined;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

const errorLogs: ErrorLog[] = [];
const MAX_ERROR_LOGS = 100;

/**
 * Log an error with context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const appError = error instanceof AppError ? error : parseError(error);

  const logEntry: ErrorLog = {
    timestamp: new Date().toISOString(),
    errorType: appError.name,
    code: appError.code,
    message: appError.message,
    stack: appError.stack,
    context,
  };

  errorLogs.push(logEntry);

  // Keep only the most recent logs
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.shift();
  }

  // Console logging in development
  if (__DEV__) {
    console.group(`[Error] ${appError.name}`);
    console.error("Message:", appError.message);
    console.error("Code:", appError.code);
    console.error("Context:", context);
    if (appError.stack) {
      console.error("Stack:", appError.stack);
    }
    console.groupEnd();
  }

  // Send to error tracking service in production
  if (!__DEV__) {
    // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
    // For now, we'll just log to console
    console.error("[Production Error]", logEntry);
  }
}

/**
 * Get all error logs
 */
export function getErrorLogs(): ErrorLog[] {
  return [...errorLogs];
}

/**
 * Clear all error logs
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

/**
 * Safely execute an async function and handle errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const appError = parseError(error);
    logError(error);
    onError?.(appError);
    return null;
  }
}

/**
 * Wrap an async function with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    onError?: (error: AppError) => void;
    defaultValue?: R;
  }
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = parseError(error);
      logError(error);
      options?.onError?.(appError);
      if (options?.defaultValue !== undefined) {
        return options.defaultValue;
      }
      throw appError;
    }
  };
}

/**
 * Check if an error is retryable
 */
export function isRetryable(error: AppError): boolean {
  if (error instanceof NetworkError) {
    return true;
  }
  if (error instanceof AppError) {
    // Retry 5xx errors and network errors
    return (error.statusCode ?? 0) >= 500;
  }
  return false;
}

/**
 * Get suggested actions for an error
 */
export function getSuggestedActions(error: AppError): string[] {
  if (error instanceof NetworkError) {
    if (error.isOffline) {
      return ["Check your internet connection", "Wait a moment and try again"];
    }
    return [
      "Wait a moment and try again",
      "Check if the server is operational",
    ];
  }

  if (error instanceof AuthError) {
    return ["Log out and log back in", "Check your account status"];
  }

  if (error instanceof ValidationError) {
    return [
      "Check your input and try again",
      "Make sure all required fields are filled",
    ];
  }

  return ["Try again", "If the problem persists, contact support"];
}
