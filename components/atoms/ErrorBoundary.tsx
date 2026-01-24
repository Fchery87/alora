import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.handleReset()}
        />
      );
    }

    return this.props.children;
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const getErrorMessage = () => {
    if (!error) return "An unknown error occurred";

    if (error.message.includes("Network")) {
      return "Unable to connect. Please check your internet connection.";
    }

    if (
      error.message.includes("authentication") ||
      error.message.includes("auth")
    ) {
      return "Authentication failed. Please sign in again.";
    }

    return error.message || "Something went wrong";
  };

  const getErrorIcon = () => {
    if (!error) return "alert-circle";
    if (error.message.includes("Network")) return "wifi";
    if (error.message.includes("auth")) return "lock-closed";
    return "alert-circle";
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.errorCard}>
        <View style={styles.iconContainer}>
          <Ionicons name={getErrorIcon() as any} size={48} color="#ef4444" />
        </View>

        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{getErrorMessage()}</Text>

        {__DEV__ && error && (
          <View style={styles.devInfo}>
            <Text style={styles.devTitle}>Development Info</Text>
            <Text style={styles.devText}>{error.toString()}</Text>
            {error.stack && (
              <Text style={styles.devStack} numberOfLines={10}>
                {error.stack}
              </Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onReset}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#ffffff" />
            <Text style={styles.resetButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => {
              console.log("Open support");
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="help-circle-outline" size={20} color="#6366f1" />
            <Text style={styles.supportButtonText}>Get Help</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          If this problem persists, please contact support
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  errorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  devInfo: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  devTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  devText: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  devStack: {
    fontSize: 10,
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6366f1",
  },
  hint: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});

export default ErrorBoundary;
