/**
 * Cross-platform MotiView wrapper
 * Uses MotiView on native platforms, simple View on web
 */
import React from "react";
import { Platform, View, ViewProps } from "react-native";
import { MotiView as MotiViewNative } from "moti";

interface MotiViewCompatProps extends ViewProps {
  from?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  children: React.ReactNode;
}

/**
 * On web, use a simple animated View with opacity
 * On native, use full MotiView animations
 */
export function MotiViewCompat({
  from,
  animate,
  transition,
  children,
  style,
  ...rest
}: MotiViewCompatProps) {
  if (Platform.OS === "web") {
    // On web, return a simple View with opacity
    return (
      <View
        style={[
          style,
          {
            opacity: 1,
          },
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  // On native, use full MotiView
  return (
    <MotiViewNative
      from={from}
      animate={animate}
      transition={transition}
      style={style}
      {...rest}
    >
      {children}
    </MotiViewNative>
  );
}
