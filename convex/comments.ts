import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// add a new comment
export const addComment = mutation({
  // Why functions don’t need all fields? Because some fields should NOT come from the client. Example: interviewerId Because a user could send: { "interviewerId": "someone-else-id" }. Client sends only: interviewId, content, rating and Backend adds the rest.

  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("comments", {
      interviewId: args.interviewId,
      content: args.content,
      rating: args.rating,
      interviewerId: identity.subject,
    });
  },
});

// get all comments for an interview
export const getComments = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();

    return comments;
  },
});
