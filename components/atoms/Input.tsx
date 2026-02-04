import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
} from "react-native";
import { MotiView } from "moti";
import { RADIUS, COLORS } from "@/lib/theme";
import { useTheme } from "@/components/providers/ThemeProvider";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  animated = true,
  delay = 0,
  style,
  onFocus,
  onBlur,
  value,
  placeholder,
  ...textInputProps
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnimation] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    animateLabel(1);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
    onBlur?.(e);
  };

  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    transform: [
      {
        translateY: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -24],
        }),
      },
      {
        scale: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
    color: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.text.tertiary, theme.colors.primary],
    }),
  };

  const dynamicStyles = React.useMemo(
    () => ({
      label: {
        color: theme.text.secondary,
      },
      inputContainer: {
        backgroundColor:
          theme.mode === "dark" ? theme.background.card : "#ffffff",
        borderColor:
          theme.mode === "dark"
            ? "rgba(212, 165, 116, 0.2)"
            : "rgba(212, 165, 116, 0.3)",
        ...theme.shadows.sm,
      },
      inputContainerFocused: {
        borderColor: theme.colors.primary,
        ...theme.shadows.md,
      },
      input: {
        color: theme.text.primary,
      },
      helperText: {
        color: theme.text.tertiary,
      },
    }),
    [theme]
  );

  const inputContent = (
    <View style={styles.container}>
      {label && (
        <Animated.Text style={[styles.label, dynamicStyles.label, labelStyle]}>
          {label}
        </Animated.Text>
      )}

      <View
        style={[
          styles.inputContainer,
          dynamicStyles.inputContainer,
          isFocused && dynamicStyles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            dynamicStyles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            style,
          ]}
          value={value}
          placeholder={isFocused ? placeholder : ""}
          placeholderTextColor={theme.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {(error || helper) && (
        <Text
          style={[
            styles.message,
            error ? styles.errorText : dynamicStyles.helperText,
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );

  if (animated) {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          delay,
          dampingRatio: 0.8,
          stiffness: 150,
        }}
      >
        {inputContent}
      </MotiView>
    );
  }

  return inputContent;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "OutfitMedium",
    fontSize: 14,
    marginBottom: 8,
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontFamily: "DMSans",
    fontSize: 16,
    paddingVertical: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  message: {
    fontFamily: "DMSans",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.danger,
  },
});
