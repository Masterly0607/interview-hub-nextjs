"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

export default function AfterSignInPage() {
  const router = useRouter();
  const { isLoading, hasRole, isInterviewer } = useUserRole();

  useEffect(() => {
    if (isLoading) return;

    if (!hasRole) {
      router.replace("/select-role");
    } else if (isInterviewer) {
      router.replace("/dashboard");
    } else {
      router.replace("/candidate");
    }
  }, [isLoading, hasRole, isInterviewer, router]);

  return null;
}
