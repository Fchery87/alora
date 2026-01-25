export function getInitialHref({
  isSignedIn,
  orgId,
}: {
  isSignedIn: boolean;
  orgId?: string | null;
}) {
  if (!isSignedIn) return "/(auth)/login";
  if (orgId) return "/(tabs)/dashboard";
  return "/(auth)/onboarding";
}
