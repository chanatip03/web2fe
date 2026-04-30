"use client";

import { Navbar } from "@/components/navbar";
import { SidebarProfessor } from "@/components/sidebarProfessor";
import { SidebarStudent } from "@/components/sidebarStudent";
import Cookies from "js-cookie";
import { useAuth } from "@/app/authcontext";

interface Props {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  const { user } = useAuth();

  const classroomName = Cookies.get("classroomName");

  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        {user?.roles.name === "teacher" ? (
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
