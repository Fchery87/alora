import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-expo";
import { convex } from "@/lib/convex";

interface ConvexProviderWrapperProps {
  children: React.ReactNode;
}

export function ConvexProviderWrapper({ children }: ConvexProviderWrapperProps) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
