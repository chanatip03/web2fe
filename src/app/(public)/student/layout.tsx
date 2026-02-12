"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { SidebarStudent } from "@/components/sidebarStudent";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const isRegisterPage = pathname === "/student/register";
  const isClassroomListPage = pathname === "/student/classroom";

  if (isRegisterPage) {
    return <>{children}</>;
  }

  return (
    <div className="jun-layout w-full h-screen">
      {isClassroomListPage ? (
        <>
          <header className="jun-header jun-layout-h-[80px]">
            <Navbar />
          </header>

          <main className="jun-content px-16">
            {children}
          </main>
        </>
      ) : (
        <>
          <header className="jun-header jun-layout-h-[80px]">
            <Navbar />
          </header>

          <div className="flex flex-1">
            <SidebarStudent />

            <main className="jun-content flex-1 overflow-y-auto px-4">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
