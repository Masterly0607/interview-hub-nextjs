// http.ts(receives events from outside) = To receive and verify Clerk webhooks and trigger backend logic in Convex when user events happen.
// It creates an HTTP endpoint in Convex that can receive webhooks (like from Clerk). When someone sends a POST request to /clerk-webhook, run this function.
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter(); // Create an HTTP router: This creates a router to hold your HTTP endpoints

http.route({
  path: "/clerk-webhook",
  method: "POST",
  // Main goal: To securely receive Clerk user events and sync new users into the Convex database when they sign up.
  /*
  How it works?
  1.Clerk creates a user
  2.This webhook catches that event
  3.Verifies it’s really from Clerk (security)
  4.Saves the user in Convex
  */
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const body = await request.text();

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        return new Response("No email found on user.created event", {
          status: 400,
        });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});
export default http;
// Handle the request: This function runs when: Clerk sends a webhook, Or anything sends a POST request to this URL.
// Note: Convex is NOT just a database, Convex is a full backend platform(database + server logic + real-time sync)
