import { describe, it, expect } from "vitest";
import { getInitialHref } from "../../lib/routing";

describe("getInitialHref", () => {
  it("routes signed-out users to login", () => {
    expect(getInitialHref({ isSignedIn: false, orgId: undefined })).toBe(
      "/(auth)/login"
    );
  });

  it("routes signed-in users without org to onboarding", () => {
    expect(getInitialHref({ isSignedIn: true, orgId: undefined })).toBe(
      "/(auth)/onboarding"
    );
  });

  it("routes signed-in users with org to dashboard", () => {
    expect(getInitialHref({ isSignedIn: true, orgId: "org_123" })).toBe(
      "/(tabs)/dashboard"
    );
  });
});
