import { defineAuth } from "convex/server";

export default defineAuth({
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
});
