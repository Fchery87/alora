import { describe, it, expect } from "vitest";
import {
  getOnboardingRedirectHref,
  shouldShowCreateBaby,
  shouldAutoSelectSingleOrganization,
} from "../../lib/onboarding";

describe("onboarding flow helpers", () => {
  it("redirects signed-out users to login", () => {
    expect(
      getOnboardingRedirectHref({
        isAuthLoaded: true,
        isSignedIn: false,
        orgId: null,
        babiesCount: null,
      })
    ).toBe("/(auth)/login");
  });

  it("does not redirect just because orgId exists when there are no babies", () => {
    expect(
      getOnboardingRedirectHref({
        isAuthLoaded: true,
        isSignedIn: true,
        orgId: "org_1",
        babiesCount: 0,
      })
    ).toBe(null);
  });

  it("redirects to dashboard when orgId exists and there is at least one baby", () => {
    expect(
      getOnboardingRedirectHref({
        isAuthLoaded: true,
        isSignedIn: true,
        orgId: "org_1",
        babiesCount: 1,
      })
    ).toBe("/(tabs)/dashboard");
  });

  it("shows CreateBaby when signed-in with org and no babies", () => {
    expect(
      shouldShowCreateBaby({
        isAuthLoaded: true,
        isSignedIn: true,
        orgId: "org_1",
        babiesCount: 0,
      })
    ).toBe(true);
  });

  it("does not show CreateBaby while babies are still loading", () => {
    expect(
      shouldShowCreateBaby({
        isAuthLoaded: true,
        isSignedIn: true,
        orgId: "org_1",
        babiesCount: null,
      })
    ).toBe(false);
  });

  it("auto-selects when exactly one membership exists and no org active", () => {
    expect(
      shouldAutoSelectSingleOrganization({
        isOrgListLoaded: true,
        currentOrgId: null,
        membershipsCount: 1,
      })
    ).toBe(true);
  });
});
