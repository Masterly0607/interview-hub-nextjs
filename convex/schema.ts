import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
});
/*
Convex is a backend that automatically keeps your app data in sync — live.
You don’t need to:

build REST APIs

manage WebSockets

handle caching

manually refresh data

Convex does that for you.

What Convex gives you

Think of Convex as 3 things in one:

Database
Store your app data (users, interviews, messages, status, etc.)

Backend logic (server code)
You write backend functions in TypeScript

Queries → read data

Mutations → write data

Actions → external APIs (email, payments)

Real-time updates (automatic)
When data changes → UI updates instantly (no refresh)
*/
