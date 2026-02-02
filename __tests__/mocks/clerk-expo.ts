import { vi } from "vitest";

export function useAuth() {
  return {
    isSignedIn: true,
    orgId: "org_test",
    isLoaded: true,
    getToken: vi.fn(async () => "token"),
    signOut: vi.fn(async () => {}),
  } as any;
}

export function useOrganizationList() {
  return {
    isLoaded: true,
    createOrganization: vi.fn(async ({ name }: { name: string }) => ({
      id: `org_${name}`,
      name,
    })),
    setActive: vi.fn(async () => {}),
    userMemberships: { data: [] },
  } as any;
}

export default { useAuth, useOrganizationList };
