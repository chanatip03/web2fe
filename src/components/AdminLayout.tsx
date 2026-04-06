"use client";

import NavbarAdmin from "./navbarAdmin";
import SidebarAdmin from "./sidebarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral01">
      <NavbarAdmin />
      <div className="flex flex-1">
        <SidebarAdmin />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
