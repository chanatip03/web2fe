"use client";

import { Navbar } from "@/components/navbar";
import { SidebarAssignment } from "@/components/sidebarAssignment";
import { Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

function LayoutContent({ children }: Readonly<Props>) {
  const searchParams = useSearchParams();
  const isStudent =
    searchParams?.get("role") === "student" ||
    searchParams?.get("type") === "backend";

  if (isStudent) {
    return (
      <main className="w-full h-screen bg-gray-950 overflow-hidden">
        {children}
      </main>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 bg-neutral01 overflow-hidden">
        <SidebarAssignment
          assignmentName={Cookies.get("assignmentName")}
          projectName={Cookies.get("projectName")}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  return (
    <Suspense
      fallback={
        <main className="w-full h-screen bg-gray-950 overflow-hidden">
          {children}
        </main>
      }
    >
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
