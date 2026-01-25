export type OnboardingState = {
  isAuthLoaded: boolean;
  isSignedIn: boolean;
  orgId: string | null | undefined;
  babiesCount: number | null;
};

export function getOnboardingRedirectHref(
  state: OnboardingState
): string | null {
  if (!state.isAuthLoaded) return null;
  if (!state.isSignedIn) return "/(auth)/login";
  if (
    state.orgId &&
    typeof state.babiesCount === "number" &&
    state.babiesCount > 0
  ) {
    return "/(tabs)/dashboard";
  }
  return null;
}

export function shouldShowCreateBaby(state: OnboardingState): boolean {
  if (!state.isAuthLoaded) return false;
  if (!state.isSignedIn) return false;
  if (!state.orgId) return false;
  if (typeof state.babiesCount !== "number") return false;
  return state.babiesCount === 0;
}

export function shouldAutoSelectSingleOrganization(params: {
  isOrgListLoaded: boolean;
  currentOrgId: string | null | undefined;
  membershipsCount: number | null;
}): boolean {
  if (!params.isOrgListLoaded) return false;
  if (params.currentOrgId) return false;
  if (typeof params.membershipsCount !== "number") return false;
  return params.membershipsCount === 1;
}
