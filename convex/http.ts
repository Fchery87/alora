import { httpRouter } from "convex/server";
import { clerk } from "./functions/webhooks/clerk";

const http = httpRouter();

http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: clerk,
});

export default http;
