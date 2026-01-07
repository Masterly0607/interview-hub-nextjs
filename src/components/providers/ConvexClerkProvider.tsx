"use client";

import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useConvexClerkAuth() {
  const clerkAuth = useClerkAuth();

  return {
    ...clerkAuth,
    getToken: (opts?: { template?: string; skipCache?: boolean }) =>
      clerkAuth.getToken({ template: "convex", ...opts }),
  };
}

export default function ConvexClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useConvexClerkAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
