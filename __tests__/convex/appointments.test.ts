import { describe, it, expect, vi } from "vitest";
import {
  createAppointmentHandler,
  listAppointmentsHandler,
  updateAppointmentHandler,
} from "../../convex/functions/appointments";
import { sanitizeTitle } from "../../convex/lib/sanitize";

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
          return "appointment_1";
        },
      },
    },
  };
}

describe("appointments.createAppointment org scoping", () => {
  it("rejects when args org id differs from identity org id", async () => {
    const { ctx, inserts } = makeCtx("org_1");

    await expect(
      createAppointmentHandler(ctx as any, {
        clerkOrganizationId: "org_other",
        title: "Checkup",
        type: "checkup",
        date: "2026-01-25",
        time: "09:00",
      })
    ).rejects.toThrow(/Not authorized/i);

    expect(inserts).toHaveLength(0);
  });

  it("inserts with clerkOrganizationId derived from identity", async () => {
    const { ctx, inserts } = makeCtx("org_1");

    await createAppointmentHandler(ctx as any, {
      clerkOrganizationId: "org_1",
      title: "Checkup",
      type: "checkup",
      date: "2026-01-25",
      time: "09:00",
    });

    expect(inserts).toHaveLength(1);
    expect(inserts[0].clerkOrganizationId).toBe("org_1");
  });
});

describe("appointments.listAppointments org scoping", () => {
  it("rejects when args org id differs from identity org id", async () => {
    const { ctx } = makeCtx("org_1");

    await expect(
      listAppointmentsHandler(ctx as any, { clerkOrganizationId: "org_other" })
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
            return {
              gte: () => ({ lte: () => ({}) }),
              lte: () => ({}),
            };
          },
        });
        return {
          filter: () => ({
            order: () => ({ take: async () => [] }),
            take: async () => [],
          }),
          order: () => ({ take: async () => [] }),
          take: async () => [],
        };
      },
    });

    await listAppointmentsHandler(ctx as any, { clerkOrganizationId: "org_1" });

    expect(indexedOrg).toBe("org_1");
  });
});

describe("appointments.updateAppointment", () => {
  it("patches sanitized fields when authorized", async () => {
    const { ctx } = makeCtx("org_1");
    const patch = vi.fn();
    ctx.db.patch = patch;
    ctx.db.get = async () =>
      ({
        _id: "appointment_1",
        clerkOrganizationId: "org_1",
      }) as any;

    await updateAppointmentHandler(ctx as any, {
      appointmentId: "appointment_1",
      title: "<script>alert(1)</script>Checkup",
      location: "Clinic <b>North</b>",
      notes: "note",
      isCompleted: true,
    });

    expect(patch).toHaveBeenCalledTimes(1);
    const [, updates] = patch.mock.calls[0];
    expect(updates.title).toBe(
      sanitizeTitle("<script>alert(1)</script>Checkup")
    );
    expect(updates.location).toBe("Clinic &lt;b&gt;North&lt;/b&gt;");
    expect(updates.notes).toBe("note");
    expect(updates.isCompleted).toBe(true);
  });
});
