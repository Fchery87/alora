import { MotiView } from "moti";
import { View, StyleSheet } from "react-native";

export function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 300,
    color: ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"][
      Math.floor(Math.random() * 5)
    ],
  }));

  return (
    <MotiView style={styles.container}>
      {particles.map((p) => (
        <MotiView
          key={p.id}
          from={{
            opacity: 1,
            scale: 1,
            translateX: 0,
            translateY: 0,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            translateX: Math.random() * 200 - 100,
            translateY: Math.random() * 200 - 100,
          }}
          transition={{
            duration: 1000 + Math.random() * 500,
            delay: Math.random() * 100,
          }}
          style={[
            styles.particle,
            { left: p.x, top: p.y, backgroundColor: p.color },
          ]}
        />
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
