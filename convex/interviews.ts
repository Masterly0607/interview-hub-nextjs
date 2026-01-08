import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const InterviewStatus = v.union(
  v.literal("upcoming"),
  v.literal("completed"),
  v.literal("succeeded"),
  v.literal("failed")
);

export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const myId = identity.subject;

    const all = await ctx.db.query("interviews").collect();

    return all.filter(
      (i) => i.candidateId === myId || i.interviewerIds?.includes(myId)
    );
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject)
      )
      .collect();

    return interviews;
  },
});

export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: InterviewStatus,
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    if (!args.interviewerIds.includes(identity.subject)) {
      throw new Error("You must be an interviewer for this interview");
    }

    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: InterviewStatus,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const interview = await ctx.db.get(args.id);
    if (!interview) throw new Error("Interview not found");

    const isCandidate = interview.candidateId === identity.subject;
    const isInterviewer = interview.interviewerIds.includes(identity.subject);
    if (!isCandidate && !isInterviewer) throw new Error("Not allowed");

    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });
  },
});

export const setInterviewResult = mutation({
  args: {
    id: v.id("interviews"),
    result: v.union(v.literal("pass"), v.literal("fail")),
    feedbackVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const interview = await ctx.db.get(args.id);
    if (!interview) throw new Error("Interview not found");

    const isInterviewer = interview.interviewerIds.includes(identity.subject);
    if (!isInterviewer) throw new Error("Not allowed");

    await ctx.db.patch(args.id, {
      result: args.result,
      feedbackVisible: args.feedbackVisible,
    });
  },
});

export const getFeedbackForInterview = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error("Interview not found");

    const isCandidate = interview.candidateId === identity.subject;
    const isInterviewer = interview.interviewerIds.includes(identity.subject);

    if (isCandidate && !interview.feedbackVisible) return [];

    if (!isCandidate && !isInterviewer) throw new Error("Not allowed");

    return await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
  },
});
