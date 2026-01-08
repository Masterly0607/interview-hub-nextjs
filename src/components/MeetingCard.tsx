"use client";

import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUserRole } from "@/hooks/useUserRole";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const { isCandidate } = useUserRole();

  const status = getMeetingStatus(interview);
  const formattedDate = format(
    new Date(interview.startTime),
    "EEEE, MMMM d · h:mm a"
  );

  // ✅ Candidate can see feedback only when allowed.
  // This query returns [] if feedbackVisible is false for candidate.
  const feedback =
    status === "completed"
      ? useQuery(api.interviews.getFeedbackForInterview, {
          interviewId: interview._id,
        })
      : undefined;

  const resultLabel =
    interview.result === "pass"
      ? "Passed"
      : interview.result === "fail"
        ? "Failed"
        : "Pending";

  // Result badge style
  const resultVariant =
    interview.result === "pass"
      ? "default"
      : interview.result === "fail"
        ? "destructive"
        : "secondary";

  return (
    <Card className="h-fit self-start">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live"
                ? "default"
                : status === "upcoming"
                  ? "secondary"
                  : "outline"
            }
          >
            {status === "live"
              ? "Live Now"
              : status === "upcoming"
                ? "Upcoming"
                : "Completed"}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">
            {interview.description}
          </CardDescription>
        )}

        {isCandidate && status === "completed" && (
          <div className="pt-2">
            <Badge variant={resultVariant as any}>{resultLabel}</Badge>
          </div>
        )}
      </CardHeader>

      {/* ✅ IMPORTANT: remove any stretching */}
      <CardContent className="space-y-4">
        {status === "live" && (
          <Button
            className="w-full"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}

        {isCandidate && status === "completed" && feedback !== undefined && (
          <>
            {feedback.length > 0 ? (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium mb-2">Feedback</p>
                <div className="space-y-2">
                  {feedback.map((c) => (
                    <p key={c._id} className="text-sm text-muted-foreground">
                      {c.content}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              // ✅ No big box if no feedback → just small text
              <p className="text-sm text-muted-foreground">
                Feedback not available yet
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;
