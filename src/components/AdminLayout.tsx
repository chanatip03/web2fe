"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import NavbarAdmin from "./navbarAdmin";
import SidebarAdmin from "./sidebarAdmin";
import { authService } from "@/services/controller";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    let isDisposed = false;

    async function ensureAdminSession() {
      try {
        const me = await authService.me();
        if (isDisposed) return;

        if (me.roles?.name !== "admin") {
          router.replace("/admin/login");
          return;
        }

        setIsAuthorizing(false);
      } catch {
        if (!isDisposed) {
          router.replace("/admin/login");
        }
      }
    }

    ensureAdminSession();

    return () => {
      isDisposed = true;
    };
  }, [router]);

  if (isAuthorizing) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "var(--color-neutral01)",
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Checking admin session...</Typography>
      </Box>
    );
  }

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
