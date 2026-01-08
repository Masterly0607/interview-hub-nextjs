"use client";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DasboardBtn";
import { useUserRole } from "@/hooks/useUserRole";

function Navbar() {
  const { role, isLoading } = useUserRole();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE - LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            InterviewHub
          </span>
        </Link>

        {/* ROLE LABEL */}
        {!isLoading && role && (
          <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
            {role === "interviewer" ? "Interviewer" : "Candidate"}
          </span>
        )}

        {/* RIGHT SIDE - ACTIONS */}
        <div className="flex items-center space-x-4 ml-auto">
          <DasboardBtn />
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
