import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-expo";
import { convex } from "@/lib/convex";
import { useCallback } from "react";
import { getClerkJwtTemplateCandidates } from "@/lib/clerk-jwt-template";

interface ConvexProviderWrapperProps {
  children: React.ReactNode;
}

function useConvexAuth() {
  const auth = useAuth();

  const getToken = useCallback(
    async (options?: Parameters<typeof auth.getToken>[0]) => {
      for (const template of getClerkJwtTemplateCandidates()) {
        try {
          const token = await auth.getToken({
            template,
            ...options,
          });
          if (token) return token;
        } catch (err) {
          console.warn(
            `[ConvexAuth] Failed to get token with '${template}' template:`,
            err
          );
        }
      }

      // Fallback: try without template (uses default session token)
      const fallbackToken = await auth.getToken(options);
      if (fallbackToken) {
        console.log("[ConvexAuth] Using fallback token without template");
      }
      return fallbackToken;
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
