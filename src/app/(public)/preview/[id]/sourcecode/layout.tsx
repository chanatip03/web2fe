"use client";

import { Navbar } from "@/components/navbar";
import { SidebarAssignment } from "@/components/sidebarAssignment";

interface Props {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <SidebarAssignment />

        <main className="flex flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}