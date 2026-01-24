import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Toast types
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Toast props
 */
export interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  showClose?: boolean;
  position?: "top" | "bottom";
}

/**
 * Toast options for context usage
 */
export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Toast state context
 */
interface ToastState {
  toasts: (ToastOptions & { id: string })[];
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = React.createContext<ToastState | null>(null);

/**
 * Toast Provider component
 * Manages toast state and renders ToastContainer
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([]);

  const showToast = React.useCallback(
    (options: ToastOptions) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...options, id }]);

      // Auto-hide after duration
      if (options.duration !== 0) {
        setTimeout(() => {
          hideToast(id);
        }, options.duration ?? 3000);
      }
    },
    [hideToast]
  );

  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast functionality
 */
export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    success: (title: string, message?: string, duration?: number) =>
      context.showToast({ type: "success", title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      context.showToast({ type: "error", title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      context.showToast({ type: "warning", title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      context.showToast({ type: "info", title, message, duration }),
    hide: (id: string) => context.hideToast(id),
    clearAll: () => context.clearAll(),
  };
}

/**
 * Toast Container
 * Renders all active toasts
 */
function ToastContainer() {
  const context = React.useContext(ToastContext);
  const { height } = Dimensions.get("window");

  if (!context) return null;

  return (
    <View style={[styles.container, { top: Platform.OS === "ios" ? 60 : 20 }]}>
      {context.toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => context.hideToast(toast.id)}
          showClose
        />
      ))}
    </View>
  );
}

/**
 * Toast Component
 * Individual toast notification
 */
export function Toast({
  type,
  title,
  message,
  duration,
  onClose,
  showClose = true,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Auto-hide after duration
    if (duration !== 0 && duration !== undefined) {
      const timer = setTimeout(() => {
        handleHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleHide = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "#ecfdf5",
          border: "#10b981",
          text: "#065f46",
          icon: "#10b981",
        };
      case "error":
        return {
          bg: "#fef2f2",
          border: "#ef4444",
          text: "#991b1b",
          icon: "#ef4444",
        };
      case "warning":
        return {
          bg: "#fffbeb",
          border: "#f59e0b",
          text: "#92400e",
          icon: "#f59e0b",
        };
      case "info":
        return {
          bg: "#eff6ff",
          border: "#3b82f6",
          text: "#1e40af",
          icon: "#3b82f6",
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: visible ? 1 : 0,
          transform: [
            {
              translateY: visible
                ? new Animated.Value(0)
                : new Animated.Value(-20),
            },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
          <Ionicons name={getIcon() as any} size={24} color={colors.icon} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message && (
            <Text style={[styles.message, { color: colors.text }]}>
              {message}
            </Text>
          )}
        </View>

        {showClose && (
          <TouchableOpacity style={styles.closeButton} onPress={handleHide}>
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 64,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

/**
 * Toast styles for animations
 */
export const shakeAnimation = {
  0: { translateX: 0 },
  10: { translateX: -5 },
  20: { translateX: 5 },
  30: { translateX: -5 },
  40: { translateX: 5 },
  50: { translateX: 0 },
};

export const slideInAnimation = {
  from: {
    opacity: 0,
    transform: [{ translateY: -20 }],
  },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
};

export const fadeOutAnimation = {
  from: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  to: {
    opacity: 0,
    transform: [{ translateY: -20 }],
  },
};
