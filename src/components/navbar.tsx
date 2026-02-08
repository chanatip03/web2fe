"use client";

import { useState } from "react";
import {
    Menu,
    MenuItem,
    IconButton,
    Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const router = useRouter();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        router.push("/logout");
    };

    return (
        <nav className="flex h-[72px] items-center justify-between bg-primary03 px-10">
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
                    <div className="-mt-1 p2">
                        eb learning Environment
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <IconButton
                    onClick={handleOpen}
                    className="flex gap-2 !text-neutral01"
                >
                    <Avatar sx={{ width: 24, height: 24 }} />
                    {/* <Avatar
                        src={user.imageUrl} 
                        alt={user.name}
                        sx={{ width: 24, height: 24 }}
                    /> */}
                    <h4 className="m-0">Tula</h4>
                    {/* <h4>{user.firstName}</h4> */}
                    <ExpandMoreIcon
                        className={`transition-transform ${openMenu ? "rotate-180" : ""
                            }`}
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
                            sx: { minWidth: 200, },
                            className: "mt-2 rounded-xl border border-neutral03",
                        },
                    }}
                >
                    <MenuItem
                        component={Link}
                        href="/profile/edit"
                        onClick={handleClose}
                        className="!p2">
                        <EditOutlinedIcon fontSize="small" className="mr-2" />
                        Edit Profile
                    </MenuItem>
                  
                    <MenuItem
                        onClick={() => {
                            handleLogout();
                        }}
                        className="!text-accent03 !p2"
                    >
                        <LogoutIcon fontSize="small" className="mr-2" />
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </nav>
    );
};

export default Navbar;
