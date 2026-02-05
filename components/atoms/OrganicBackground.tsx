import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MotiView } from "moti";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";
import { BACKGROUND, COLORS } from "@/lib/theme";

const { width, height } = Dimensions.get("window");

// Optional organic blob shapes (disabled by default for the Care Journal direction)
const BLOB_COLORS = [
  { start: COLORS.terracotta, end: COLORS.terracotta, opacity: 0.06 },
  { start: COLORS.sage, end: COLORS.sage, opacity: 0.05 },
  { start: COLORS.gold, end: COLORS.gold, opacity: 0.04 },
  { start: BACKGROUND.tertiary, end: BACKGROUND.secondary, opacity: 0.08 },
];

interface OrganicShapeProps {
  index: number;
}

function OrganicShape({ index }: OrganicShapeProps) {
  const color = BLOB_COLORS[index % BLOB_COLORS.length];

  // Different blob paths for variety
  const paths = [
    "M420,320 Q480,220 520,320 T620,320 T720,320 T820,320 V600 H420 Z",
    "M-50,150 Q50,50 150,150 T350,150 T550,150 V400 H-50 Z",
    "M200,-50 Q300,-150 400,-50 T600,-50 V200 H200 Z",
    "M-100,450 Q0,350 100,450 T300,450 V700 H-100 Z",
  ];

  const path = paths[index % paths.length];

  // Animation configurations for organic movement
  const animations = [
    {
      translateX: [0, 20, -10, 0],
      translateY: [0, -15, 10, 0],
      scale: [1, 1.05, 0.98, 1],
    },
    {
      translateX: [0, -20, 15, 0],
      translateY: [0, 10, -20, 0],
      scale: [1, 0.97, 1.03, 1],
    },
    {
      translateX: [0, 15, -20, 0],
      translateY: [0, -20, 15, 0],
      scale: [1, 1.02, 0.99, 1],
    },
    {
      translateX: [0, -15, 10, 0],
      translateY: [0, 20, -10, 0],
      scale: [1, 0.98, 1.04, 1],
    },
  ];

  const animation = animations[index % animations.length];

  return (
    <MotiView
      style={[StyleSheet.absoluteFill, { zIndex: index }]}
      animate={{
        translateX: animation.translateX,
        translateY: animation.translateY,
        scale: animation.scale,
      }}
      transition={{
        type: "timing",
        duration: 8000 + index * 1000,
        loop: true,
        repeatReverse: true,
      }}
    >
      <Svg
        width={width + 200}
        height={height + 200}
        viewBox="0 0 800 700"
        style={{
          position: "absolute",
          opacity: color.opacity,
        }}
      >
        <Defs>
          <RadialGradient id={`gradient-${index}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color.start} />
            <Stop offset="100%" stopColor={color.end} />
          </RadialGradient>
        </Defs>
        <Path d={path} fill={`url(#gradient-${index})`} />
      </Svg>
    </MotiView>
  );
}

interface OrganicBackgroundProps {
  children: React.ReactNode;
  showBlobs?: boolean;
  showGrain?: boolean;
}

export function OrganicBackground({
  children,
  showBlobs = false,
  showGrain = false,
}: OrganicBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Base warm cream background */}
      <View style={styles.baseBackground} />

      {/* Animated organic blob shapes */}
      {showBlobs && (
        <View style={styles.blobContainer}>
          {[0, 1, 2, 3].map((index) => (
            <OrganicShape key={index} index={index} />
          ))}
        </View>
      )}

      {/* Grain texture overlay */}
      {showGrain && <View style={styles.grainOverlay} pointerEvents="none" />}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND.primary,
  },
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});

export default OrganicBackground;
