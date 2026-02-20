"use client";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface SidebarStudentProps {
  classroomName?: string;
}

const sidebarStudentItems = [
  {
    name: "Syllabus",
    icon: <BookOutlinedIcon />,
  },
  {
    name: "Assignment",
    href: "/student/",
    icon: <AssignmentOutlinedIcon />,
  },
  {
    name: "Scorebook and Feedback",
    href: "/student/",
    icon: <NotificationsOutlinedIcon />,
  },
];

export const SidebarStudent = ({ classroomName }: SidebarStudentProps) => {
  const pathname = usePathname();
  const params = useParams();
  const classroomId = params.id;
  return (
    <aside className="w-[260px] h-screen bg-white border-r border-neutral02 ">
      <div className="bg-secondary04 text-white h-[145px] flex items-center px-4">
        <h2>{classroomName}</h2>
      </div>

      <nav className="mt-4">
        <ul className="flex flex-col">
          {sidebarStudentItems.map((item) => {
            const isActive = pathname === item.href;

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
