"use client";

import { Navbar } from "@/components/navbar";
import { SidebarProfessor } from "@/components/sidebarProfessor";
import { SidebarStudent } from "@/components/sidebarStudent";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  const role = Cookies.get("role");
  const classroomName = Cookies.get("classroomName");

  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        {role === "teacher" ? (
          <SidebarProfessor classroomName={classroomName} />
        ) : (
          <SidebarStudent classroomName={classroomName} />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-20 py-10">{children}</main>
      </div>
    </>
  );
}
