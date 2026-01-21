import { MotiView } from "moti";

interface FadeContainerProps {
  children: React.ReactNode;
}

export function FadeContainer({ children }: FadeContainerProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250,
      }}
    >
      {children}
    </MotiView>
  );
}

interface ScaleContainerProps {
  children: React.ReactNode;
}

export function ScaleContainer({ children }: ScaleContainerProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250,
      }}
    >
      {children}
    </MotiView>
  );
}
