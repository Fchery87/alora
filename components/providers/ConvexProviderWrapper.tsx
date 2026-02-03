import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-expo";
import { convex } from "@/lib/convex";
import { useCallback } from "react";

interface ConvexProviderWrapperProps {
  children: React.ReactNode;
}

function useConvexAuth() {
  const auth = useAuth();

  const getToken = useCallback(
    async (options?: Parameters<typeof auth.getToken>[0]) => {
      try {
        // Try to get token with 'convex' template first
        const token = await auth.getToken({
          template: "convex",
          ...options,
        });
        return token;
      } catch (err) {
        console.error(
          "[ConvexAuth] Failed to get token with 'convex' template:",
          err
        );
        // Fallback: try without template (uses default session token)
        try {
          const fallbackToken = await auth.getToken(options);
          console.log("[ConvexAuth] Using fallback token without template");
          return fallbackToken;
        } catch (fallbackErr) {
          console.error(
            "[ConvexAuth] Fallback token also failed:",
            fallbackErr
          );
          throw fallbackErr;
        }
      }
    },
    [auth]
  );

  return {
    ...auth,
    getToken,
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
