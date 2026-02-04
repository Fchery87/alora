export function getClerkJwtTemplateName(): string {
  const fromEnv = process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE;
  if (typeof fromEnv === "string" && fromEnv.trim().length > 0) return fromEnv;

  // Default template name used in many setups.
  // If your Clerk dashboard uses a different template name (e.g. "Convex"),
  // set `EXPO_PUBLIC_CLERK_JWT_TEMPLATE=Convex`.
  return "convex";
}

export function getClerkJwtTemplateCandidates(): string[] {
  const candidates = new Set<string>();
  candidates.add(getClerkJwtTemplateName());

  // Common casing variants seen in dashboards.
  candidates.add("convex");
  candidates.add("Convex");

  return [...candidates];
}

