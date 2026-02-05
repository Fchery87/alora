import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { captureException, addBreadcrumb } from "@/lib/sentry";
import { BACKGROUND, COLORS, SHADOWS, TEXT as THEME_TEXT, TYPOGRAPHY } from "@/lib/theme";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors
 * and reports them to Sentry
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
      ...this.state,
    });

    addBreadcrumb("Error boundary caught exception", "error", "error", {
      errorMessage: error.message,
      errorName: error.name,
    });

    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    addBreadcrumb("User reset error boundary", "error", "info");
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Something went wrong</Text>

            <Text style={styles.message}>
              We&apos;ve reported this error to our team. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.stackText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: BACKGROUND.primary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    ...SHADOWS.md,
  },
  title: {
    ...TYPOGRAPHY.headings.h2,
    color: THEME_TEXT.primary,
    marginBottom: 16,
  },
  message: {
    ...TYPOGRAPHY.body.regular,
    color: THEME_TEXT.secondary,
    marginBottom: 16,
  },
  errorContainer: {
    maxHeight: 200,
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  errorText: {
    color: COLORS.danger,
    fontFamily: "monospace",
    fontSize: 12,
  },
  stackText: {
    color: THEME_TEXT.tertiary,
    fontFamily: "monospace",
    fontSize: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: THEME_TEXT.primaryInverse,
  },
});

/**
 * Hook to manually report errors
 */
export function useErrorHandler() {
  return {
    captureError: (error: Error, context?: Record<string, any>) => {
      captureException(error, context);
    },
  };
}
