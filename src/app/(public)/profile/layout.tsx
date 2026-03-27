"use client";

import { Navbar } from "@/components/navbar";

interface Props {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: Readonly<Props>) {
  return (
    <>
      <Navbar />
      <div className="flex bg-neutral01 min-h-screen">
        <main className="flex-1 overflow-y-auto px-20 py-10">{children}</main>
      </div>
    </>
  );
}
