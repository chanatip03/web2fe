"use client";

import { useEffect, useState } from "react";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Badge } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { userService } from "@/services/controller";

const sidebarAdminItems = [
  {
    name: "Container",
    href: "/admin/container",
    icon: <DnsOutlinedIcon />,
  },
  {
    name: "Student",
    href: "/admin/student",
    icon: <SchoolOutlinedIcon />,
  },
  {
    name: "Teacher",
    href: "/admin/teacher",
    icon: <Groups2OutlinedIcon />,
  },
  {
    name: "Request",
    href: "/admin/request",
    icon: <NotificationsOutlinedIcon />,
    hasBadge: true,
  },
];

export const SidebarAdmin = () => {
  const pathname = usePathname();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadRequestCount = async () => {
      try {
        const requests = await userService.getTeacherRequests();
        if (!active) return;
        setRequestCount(requests.length);
      } catch {
        if (!active) return;
        setRequestCount(0);
      }
    };

    void loadRequestCount();

    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="w-[220px] min-w-[220px] min-h-screen bg-[#ffffff] border-r border-neutral02 pt-4">
      <nav>
        <ul className="flex flex-col">
          {sidebarAdminItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            const iconElement =
              item.hasBadge && requestCount > 0 ? (
                <Badge
                  badgeContent={requestCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 10,
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              );

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 h-[52px] px-6 transition-all duration-200 border-l-4
                    ${
                      isActive
                        ? "bg-primary01 border-primary03"
                        : "border-transparent hover:bg-neutral02/50"
                    }
                  `}
                >
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-primary03"
                        : "text-neutral05 group-hover:text-black"
                    }`}
                  >
                    {iconElement}
                  </span>

                  {isActive ? (
                    <h5 className="text-primary03">{item.name}</h5>
                  ) : (
                    <p className="text-neutral05 group-hover:text-black p2">
                      {item.name}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
