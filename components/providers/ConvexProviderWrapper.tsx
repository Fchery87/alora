import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-expo";
import { convex } from "@/lib/convex";

interface ConvexProviderWrapperProps {
  children: React.ReactNode;
}

function useConvexAuth() {
  const auth = useAuth();
  return {
    ...auth,
    getToken: async (options?: Parameters<typeof auth.getToken>[0]) => {
      return auth.getToken({
        template: "convex",
        skipCache: true,
        ...options,
      });
    },
  };
}

export function ConvexProviderWrapper({
  children,
}: ConvexProviderWrapperProps) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useConvexAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
