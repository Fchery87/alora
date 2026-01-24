import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convex";

interface ConvexProviderWrapperProps {
  children: React.ReactNode;
}

export function ConvexProviderWrapper({ children }: ConvexProviderWrapperProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
