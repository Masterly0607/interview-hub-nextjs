import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),

    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("succeeded"),
      v.literal("failed")
    ),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
    result: v.optional(v.union(v.literal("pass"), v.literal("fail"))),
    feedbackVisible: v.optional(v.boolean()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),
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
