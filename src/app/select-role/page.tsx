"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

type Role = "interviewer" | "candidate";

export default function SelectRolePage() {
  const router = useRouter();
  const setMyRole = useMutation(api.users.setMyRole);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  const selectRole = async (role: Role) => {
    try {
      setSaving(true);
      await setMyRole({ role });
      router.push("/"); // go to home after choose role
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">Choose your role</h1>
            <p className="text-muted-foreground mt-2">
              Your role controls what you can access inside InterviewHub.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Interviewer */}
            <button
              type="button"
              onClick={() => setSelectedRole("interviewer")}
              className={[
                "text-left rounded-xl border bg-card p-6 shadow-sm transition",
                "hover:shadow-md",
                selectedRole === "interviewer"
                  ? "ring-2 ring-emerald-600 border-emerald-600"
                  : "",
              ].join(" ")}
            >
              <h2 className="text-2xl font-semibold">Interviewer</h2>
              <p className="text-muted-foreground mt-2">
                Manage interviews, evaluate candidates, and publish results.
              </p>

              <ul className="mt-5 text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Start instant interviews (New Call)</li>
                <li>Join interviews via invitation link (Join Interview)</li>
                <li>Schedule interviews for later (Schedule)</li>
                <li>Leave comments and ratings after the interview</li>
                <li>Mark candidates as Pass or Fail</li>
                <li>Control when feedback becomes visible to the candidate</li>
                <li>
                  Review past interview sessions & recordings (Recordings)
                </li>
              </ul>
            </button>

            {/* Candidate */}
            <button
              type="button"
              onClick={() => setSelectedRole("candidate")}
              className={[
                "text-left rounded-xl border bg-card p-6 shadow-sm transition",
                "hover:shadow-md",
                selectedRole === "candidate"
                  ? "ring-2 ring-emerald-600 border-emerald-600"
                  : "",
              ].join(" ")}
            >
              <h2 className="text-2xl font-semibold">Candidate</h2>
              <p className="text-muted-foreground mt-2">
                Attend interviews, solve problems in the live editor, and review
                results.
              </p>

              <ul className="mt-5 text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Join interviews via a shared link from an interviewer</li>
                <li>View your scheduled interviews on the home page</li>
                <li>
                  Use the in-call code editor to write solutions during the
                  interview
                </li>
                <li>
                  Code is reviewed by the interviewer (execution may be limited
                  depending on setup)
                </li>
                <li>
                  See your final result: Pass / Fail (after interviewer submits)
                </li>
                <li>Read interviewer feedback (only when it is shared)</li>
                <li>Review your past interviews & recordings (Recordings)</li>
              </ul>
            </button>
          </div>

          {/* Testing hint */}
          <div className="mt-8 rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold">Testing both roles</h3>
            <p className="text-muted-foreground mt-1">
              Each account can have only one role. To test both Interviewer and
              Candidate on one machine:
            </p>
            <ul className="mt-3 text-sm space-y-2 list-disc list-inside text-muted-foreground">
              <li>
                Open the app in an <b>Incognito</b> window
              </li>
              <li>Or use a different browser (Chrome / Edge / Firefox)</li>
              <li>Sign in with a different account for the other role</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom buttons (always pinned) */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur px-4 py-4">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => selectRole("interviewer")}
            disabled={saving}
            className={[
              "w-full rounded-lg px-4 py-3 font-medium transition",
              "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed",
              selectedRole === "interviewer" ? "" : "opacity-90",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Continue as Interviewer"}
          </button>

          <button
            type="button"
            onClick={() => selectRole("candidate")}
            disabled={saving}
            className={[
              "w-full rounded-lg px-4 py-3 font-medium transition",
              "border bg-card hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed",
              selectedRole === "candidate" ? "ring-2 ring-emerald-600" : "",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Continue as Candidate"}
          </button>
        </div>
      </div>
    </div>
  );
}
