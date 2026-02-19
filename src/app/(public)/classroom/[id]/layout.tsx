"use client";

import { Navbar } from "@/components/navbar";
import { SidebarProfessor } from "@/components/sidebarProfessor";
import { SidebarStudent } from "@/components/sidebarStudent";

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

const role: "student" | "teacher" | "" = "";

export default function ClassroomLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        {role === "teacher" ? <SidebarProfessor /> : <SidebarStudent />}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-24 py-8">{children}</main>
      </div>
    </>
  );
}
