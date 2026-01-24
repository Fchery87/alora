import { MotiView } from "moti";
import { Pressable } from "react-native";

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function AnimatedContainer({
  children,
  delay = 0,
  duration = 300,
}: AnimatedContainerProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", 
        duration,
        delay,
      }}
    >
      {children}
    </MotiView>
  );
}

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring",  duration: 300 }}
    >
      {children}
    </MotiView>
  );
}

export function SlideInLeft({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "spring",  type: "spring" }}
    >
      {children}
    </MotiView>
  );
}

export function SlideInRight({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "spring",  type: "spring" }}
    >
      {children}
    </MotiView>
  );
}

export function ScaleIn({ children }: { children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring",  type: "spring" }}
    >
      {children}
    </MotiView>
  );
}
