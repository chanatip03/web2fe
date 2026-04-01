"use client";

import { useEffect, useState } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/controller";
import { useAuth } from "@/app/authcontext";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();

  const { user, setUser } = useAuth();

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
    } catch (_) {
      // ignore — cookie may already be invalid
    }
    setUser(null);
    router.push("/auth");
  };

  useEffect(() => {
    async function loadMe() {
      try {
        if (user) return;

        const me = await authService.me();

        console.log(me);
        setUser(me);
      } catch (err) {
        console.error(err);
      }
    }

    loadMe();
  }, [user, setUser]);

  return (
    <nav className="flex h-[72px] items-center justify-between bg-primary03 px-10">
      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="flex items-center">
        <IconButton onClick={handleOpen} className="flex gap-2 !text-neutral01">
          <Avatar
            src={user?.user?.image_url || undefined}
            sx={{ width: 32, height: 32 }}
          />
          <h4 className="m-0">{user?.user?.first_name || "Loading..."}</h4>

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
              sx: { minWidth: 200 },
              className: "mt-2 rounded-xl border border-neutral03",
            },
          }}
        >
          <MenuItem component={Link} href="/profile/edit" onClick={handleClose}>
            <EditOutlinedIcon fontSize="small" className="mr-2" />
            Edit Profile
          </MenuItem>

          <MenuItem onClick={handleLogout} className="!text-accent03">
            <LogoutIcon fontSize="small" className="mr-2" />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
