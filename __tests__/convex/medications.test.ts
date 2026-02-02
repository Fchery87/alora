import { describe, it, expect } from "vitest";
import {
  createMedicationHandler,
  listMedicationsHandler,
} from "../../convex/functions/medications";

const identity = (orgId: string) =>
  ({
    tokenIdentifier: "token|clerk|abc",
    subject: "user_abc",
    issuer: "https://clerk.dev",
    email: "user@example.com",
    name: "Test User",
    pictureUrl: "https://example.com/avatar.png",
    orgId,
  }) as any;

function makeCtx(orgId: string) {
  const inserts: any[] = [];
  return {
    inserts,
    ctx: {
      auth: { getUserIdentity: async () => identity(orgId) },
      db: {
        query: (_table: string) => ({
          withIndex: (_name: string, _fn: any) => ({
            first: async () => ({ _id: "user_1" }),
          }),
        }),
        patch: async () => {},
        get: async () => null,
        insert: async (_table: string, doc: any) => {
          inserts.push(doc);
          return "medication_1";
        },
      },
    },
  };
}

describe("medications.createMedication org scoping", () => {
  it("rejects when args org id differs from identity org id", async () => {
    const { ctx, inserts } = makeCtx("org_1");

    await expect(
      createMedicationHandler(ctx as any, {
        clerkOrganizationId: "org_other",
        name: "Vitamin D",
        type: "supplement",
        startDate: "2026-01-25",
      })
    ).rejects.toThrow(/Not authorized/i);

    expect(inserts).toHaveLength(0);
  });

  it("inserts with clerkOrganizationId derived from identity", async () => {
    const { ctx, inserts } = makeCtx("org_1");

    await createMedicationHandler(ctx as any, {
      clerkOrganizationId: "org_1",
      name: "Vitamin D",
      type: "supplement",
      startDate: "2026-01-25",
    });

    expect(inserts).toHaveLength(1);
    expect(inserts[0].clerkOrganizationId).toBe("org_1");
  });
});

describe("medications.listMedications org scoping", () => {
  it("rejects when args org id differs from identity org id", async () => {
    const { ctx } = makeCtx("org_1");

    await expect(
      listMedicationsHandler(ctx as any, { clerkOrganizationId: "org_other" })
    ).rejects.toThrow(/Not authorized/i);
  });

  it("queries by identity org id", async () => {
    let indexedOrg: string | undefined;
    const { ctx } = makeCtx("org_1");

    ctx.db.query = () => ({
      withIndex: (_name: string, fn: any) => {
        fn({
          eq: (_field: string, value: string) => {
            indexedOrg = value;
          },
        });
        return { collect: async () => [] };
      },
    });

    await listMedicationsHandler(ctx as any, { clerkOrganizationId: "org_1" });

    expect(indexedOrg).toBe("org_1");
  });
});
