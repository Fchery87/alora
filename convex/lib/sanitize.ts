/**
 * Server-side input sanitization for Convex functions
 * These functions run on the server to sanitize user input before storage
 */

// HTML tags that are not allowed in any input
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*\/?>/gi,
  /<form[^>]*>.*?<\/form>/gi,
  /<input[^>]*\/?>/gi,
  /<textarea[^>]*>.*?<\/textarea>/gi,
  /<button[^>]*>.*?<\/button>/gi,
  /<link[^>]*\/?>/gi,
  /<style[^>]*>.*?<\/style>/gi,
  /<meta[^>]*\/?>/gi,
];

// Event handler attributes
const EVENT_HANDLER_PATTERN = /\son\w+\s*=/gi;

// Dangerous protocols
const DANGEROUS_PROTOCOLS = /javascript:|vbscript:|data:|file:|about:/gi;

/**
 * Sanitize a string by removing dangerous HTML and scripts
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input;

  // Remove dangerous HTML patterns
  DANGEROUS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Remove event handlers
  sanitized = sanitized.replace(EVENT_HANDLER_PATTERN, "");

  // Remove dangerous protocols
  sanitized = sanitized.replace(DANGEROUS_PROTOCOLS, "");

  // Remove null bytes
  sanitized = sanitized.replace(/\x00/g, "");

  // Normalize line endings
  sanitized = sanitized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove remaining angle brackets for safety
  sanitized = sanitized.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return sanitized;
}

/**
 * Sanitize user content (notes, journal entries)
 * @param content - The content to sanitize
 * @returns Sanitized content
 */
export function sanitizeUserContent(content: string): string {
  if (!content || typeof content !== "string") {
    return "";
  }

  let sanitized = content;

  // Remove null bytes
  sanitized = sanitized.replace(/\x00/g, "");

  // Normalize line endings
  sanitized = sanitized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Limit consecutive newlines
  sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n");

  // Apply full sanitization
  sanitized = sanitizeText(sanitized);

  return sanitized;
}

/**
 * Sanitize a name or title
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  let sanitized = name.trim();

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // Apply sanitization
  sanitized = sanitizeText(sanitized);

  return sanitized;
}

/**
 * Sanitize an array of strings
 * @param arr - The array to sanitize
 * @returns Sanitized array
 */
export function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .filter((item) => typeof item === "string")
    .map((item) => sanitizeText(item))
    .filter((item) => item.length > 0);
}

/**
 * Sanitize appointment/medication notes
 * @param notes - The notes to sanitize
 * @returns Sanitized notes
 */
export function sanitizeNotes(notes: string | undefined): string | undefined {
  if (!notes) return undefined;
  return sanitizeUserContent(notes);
}

/**
 * Sanitize location string
 * @param location - The location to sanitize
 * @returns Sanitized location
 */
export function sanitizeLocation(
  location: string | undefined
): string | undefined {
  if (!location) return undefined;
  return sanitizeText(location);
}

/**
 * Sanitize milestone title and description
 * @param title - The title to sanitize
 * @returns Sanitized title
 */
export function sanitizeTitle(title: string): string {
  return sanitizeName(title);
}

/**
 * Sanitize description text
 * @param description - The description to sanitize
 * @returns Sanitized description
 */
export function sanitizeDescription(
  description: string | undefined
): string | undefined {
  if (!description) return undefined;
  return sanitizeUserContent(description);
}
