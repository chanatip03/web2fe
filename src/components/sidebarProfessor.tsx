"use client";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface SidebarProfessorProps {
  classroomName?: string;
}

const sidebarProfessorItems = [
  {
    name: "Syllabus",
    href: "/syllabus",
    icon: <BookOutlinedIcon />,
  },
  {
    name: "Assignment",
    href: "/assignment",
    icon: <AssignmentOutlinedIcon />,
  },
  {
    name: "Members",
    href: "/members",
    icon: <GroupsOutlinedIcon />,
  },
  {
    name: "Scorebook",
    href: "/scorebook",
    icon: <EmojiEventsOutlinedIcon />,
  },
  {
    name: "Setting",
    href: "/setting",
    icon: <SettingsOutlinedIcon />,
  },
];

export const SidebarProfessor = ({ classroomName: classroomNameProp }: SidebarProfessorProps) => {
  const pathname = usePathname();
  const params = useParams();
  const classroomId = params.id;

  // Read cookie on client only to avoid SSR hydration mismatch
  const [classroomName, setClassroomName] = useState<string>("");
  useEffect(() => {
    setClassroomName(classroomNameProp ?? Cookies.get("classroomName") ?? "");
  }, [classroomNameProp]);
  return (
    <aside className="w-[260px] h-screen bg-[#ffffff] border-r border-neutral02 ">
      <div className="bg-secondary04 text-white h-[145px] flex items-center px-2">
        <h3>{classroomName}</h3>
      </div>

      <nav className="mt-4">
        <ul className="flex flex-col">
          {sidebarProfessorItems.map((item) => {
            const isActive = pathname.startsWith(
              `/classroom/${classroomId}${item.href}`,
            );

            return (
              <li key={item.name}>
                <Link
                  href={`/classroom/${classroomId}${item.href}`}
                  className={`group flex items-center gap-3 h-[52px] px-6 transition-colors border-l-6
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
                    {item.icon}
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
