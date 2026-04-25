"use client";

import { Navbar } from "@/components/navbar";
import { SidebarStudent } from "@/components/sidebarStudent";
import { SidebarAssignment } from "@/components/sidebarAssignment";
import { useState, useEffect, Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

function LayoutContent({ children }: Readonly<Props>) {
  // Read cookie only on the client to avoid SSR/client hydration mismatch.
  const [classroomName, setClassroomName] = useState<string | undefined>(undefined);
  useEffect(() => {
    setClassroomName(Cookies.get("classroomName"));
  }, []);

  const searchParams = useSearchParams();
  const isStudent = searchParams?.get("role") === "student" || searchParams?.get("type") === "backend";

  if (isStudent) {
    return <main className="w-full h-screen bg-gray-950 overflow-hidden">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        <SidebarAssignment />
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-20 py-10">{children}</main>
      </div>
    </>
  );
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  return (
    <Suspense fallback={<main className="w-full h-screen bg-gray-950 overflow-hidden">{children}</main>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
