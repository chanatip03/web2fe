"use client";

import { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authService } from "@/services/controller";

export const NavbarAdmin = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await authService.logout();
    } catch {
      // Ignore logout failures and still return to the login page.
    }
    router.replace("/admin/login");
  };

  return (
    <nav className="flex h-[72px] items-center justify-between bg-primary03 px-10">
      {/* LEFT — Logo */}
      <div className="flex items-center gap-2 text-neutral01">
        <Image
          src="/WLogo.png"
          alt="W Logo"
          width={54}
          height={54}
          className="object-contain"
          priority
        />
        <div className="leading-tight">
          <h3 className="mt-1">EB2</h3>
          <div className="-mt-1 p2">eb learning Environment</div>
        </div>
      </div>

      {/* RIGHT — Admin dropdown */}
      <div className="flex items-center">
        <IconButton onClick={handleOpen} className="flex gap-2 !text-neutral01">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1565C0" }}>A</Avatar>
          <h4 className="m-0">Admin</h4>
          <ExpandMoreIcon
            className={`transition-transform ${openMenu ? "rotate-180" : ""}`}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: { minWidth: 160 },
              className: "mt-2 rounded-xl border border-neutral03",
            },
          }}
        >
          <MenuItem onClick={handleLogout} className="!text-accent03">
            <LogoutIcon fontSize="small" className="mr-2" />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
