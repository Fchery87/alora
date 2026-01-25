import { describe, it, expect } from "vitest";
import {
  handleOrganizationCreatedHandler,
  handleOrganizationMembershipCreatedHandler,
  handleOrganizationUpdatedHandler,
  handleUserCreatedHandler,
  handleUserUpdatedHandler,
  handleUserDeletedHandler,
  handleOrganizationDeletedHandler,
} from "../../convex/functions/webhooks/handlers";

function makeDb() {
  const users: any[] = [];
  const families: any[] = [];
  const inserts: { table: string; doc: any }[] = [];
  const patches: { id: string; patch: any }[] = [];

  const db = {
    query: (table: string) => ({
      withIndex: (_index: string, fn: any) => {
        let field: string | undefined;
        let value: string | undefined;
        fn({
          eq: (f: string, v: string) => {
            field = f;
            value = v;
          },
        });

        const collection = table === "users" ? users : families;
        const match =
          collection.find((d) => (field ? d[field] === value : false)) ?? null;

        return {
          first: async () => match,
        };
      },
    }),
    insert: async (table: string, doc: any) => {
      const id = `${table}_1`;
      const record = { _id: id, ...doc };
      inserts.push({ table, doc: record });
      if (table === "users") users.push(record);
      if (table === "families") families.push(record);
      return id;
    },
    patch: async (id: string, patch: any) => {
      patches.push({ id, patch });
      const all = [...users, ...families];
      const idx = all.findIndex((d) => d._id === id);
      if (idx >= 0) all[idx] = { ...all[idx], ...patch };
    },
  };

  return { db, users, families, inserts, patches };
}

describe("webhooks handlers", () => {
  it("handleUserCreated creates user if missing", async () => {
    const { db, inserts } = makeDb();
    const res = await handleUserCreatedHandler(
      { db } as any,
      { clerkUserId: "user_1", email: "a@b.com" } as any
    );
    expect(res.status).toBe("created");
    expect(inserts[0].table).toBe("users");
    expect(inserts[0].doc.clerkUserId).toBe("user_1");
  });

  it("handleUserCreated is idempotent", async () => {
    const { db } = makeDb();
    await handleUserCreatedHandler({ db } as any, { clerkUserId: "user_1" });
    const res = await handleUserCreatedHandler({ db } as any, {
      clerkUserId: "user_1",
    });
    expect(res.status).toBe("existing");
  });

  it("handleOrganizationCreated creates family if missing", async () => {
    const { db, inserts } = makeDb();
    const res = await handleOrganizationCreatedHandler(
      { db } as any,
      { clerkOrganizationId: "org_1", organizationName: "Org" } as any
    );
    expect(res.status).toBe("created");
    expect(inserts[0].table).toBe("families");
    expect(inserts[0].doc.clerkOrganizationId).toBe("org_1");
  });

  it("handleOrganizationMembershipCreated patches user org id when user+family exist", async () => {
    const { db, users, families, patches } = makeDb();
    users.push({ _id: "users_1", clerkUserId: "user_1" });
    families.push({ _id: "families_1", clerkOrganizationId: "org_1" });

    const res = await handleOrganizationMembershipCreatedHandler(
      { db } as any,
      { clerkOrganizationId: "org_1", clerkUserId: "user_1" } as any
    );

    expect(res.status).toBe("synced");
    expect(patches).toHaveLength(1);
    expect(patches[0].id).toBe("users_1");
    expect(patches[0].patch.clerkOrganizationId).toBe("org_1");
  });

  it("handleOrganizationUpdated returns not_found when family missing", async () => {
    const { db } = makeDb();
    const res = await handleOrganizationUpdatedHandler(
      { db } as any,
      { clerkOrganizationId: "org_1", organizationName: "New" } as any
    );
    expect(res.status).toBe("not_found");
  });

  it("handleUserUpdated returns not_found when user missing", async () => {
    const { db } = makeDb();
    const res = await handleUserUpdatedHandler(
      { db } as any,
      { clerkUserId: "user_1", email: "x@y.com" } as any
    );
    expect(res.status).toBe("not_found");
  });

  it("handleUserDeleted returns not_found when user missing", async () => {
    const { db } = makeDb();
    const res = await handleUserDeletedHandler(
      { db } as any,
      { clerkUserId: "user_1" } as any
    );
    expect(res.status).toBe("not_found");
  });

  it("handleOrganizationDeleted returns not_found when family missing", async () => {
    const { db } = makeDb();
    const res = await handleOrganizationDeletedHandler(
      { db } as any,
      { clerkOrganizationId: "org_1" } as any
    );
    expect(res.status).toBe("not_found");
  });
});
