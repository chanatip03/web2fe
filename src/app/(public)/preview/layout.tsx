"use client";

import { Navbar } from "@/components/navbar";
import { SidebarStudent } from "@/components/sidebarStudent";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  // Read cookie only on the client to avoid SSR/client hydration mismatch.
  const [classroomName, setClassroomName] = useState<string | undefined>(undefined);
  useEffect(() => {
    setClassroomName(Cookies.get("classroomName"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        <SidebarStudent classroomName={classroomName} />
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-20 py-10">{children}</main>
      </div>
    </>
  );
}
