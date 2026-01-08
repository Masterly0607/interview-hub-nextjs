"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import StreamClientProvider from "@/components/providers/StreamClientProvider";
import { useUserRole } from "@/hooks/useUserRole";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, hasRole } = useUserRole();

  useEffect(() => {
    if (isLoading) return;

    // allow staying on the select role page
    if (pathname === "/select-role") return;

    // if user has no role yet -> force select role
    if (!hasRole) router.replace("/select-role");
  }, [isLoading, hasRole, router, pathname]);

  return <StreamClientProvider>{children}</StreamClientProvider>;
}
