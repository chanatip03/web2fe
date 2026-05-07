"use client";
import TvIcon from "@mui/icons-material/Tv";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export const SidebarAssignment = ({
  assignmentName,
  projectName,
}: {
  assignmentName: string | undefined;
  projectName: string | undefined;
}) => {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.id as string; // /preview/[id] — id = project/submission id

  // Sidebar items — paths match the actual folder names under /preview/[id]/
  const sidebarItems = [
    {
      name: "Preview",
      // Root preview page has no sub-segment
      href: `/preview/${projectId}`,
      icon: <TvIcon />,
    },
    {
      name: "Source Code",
      href: `/preview/${projectId}/sourcecode`,
      icon: <SourceOutlinedIcon />,
    },
    {
      name: "Test Result",
      href: `/preview/${projectId}/testresult`,
      icon: <AssignmentLateOutlinedIcon />,
    },
    {
      name: "Score and Feedback",
      href: `/preview/${projectId}/scorebook`,
      icon: <EmojiEventsOutlinedIcon />,
    },
  ];

  // "Back to assignment" — classroom ID isn't in the URL here, use cookie fallback
  const classroomId = Cookies.get("classroomId");
  const assignmentId = Cookies.get("assignmentId");
  const backHref =
    classroomId && assignmentId
      ? `/classroom/${classroomId}/assignment/${assignmentId}`
      : "/classroom";

  return (
    <aside className="w-[260px] bg-[#ffffff] border-r border-neutral02 flex flex-col justify-between">
      <div>
        <div className="bg-secondary04 text-white h-[145px] flex flex-col justify-between p-6 pt-8">
          <h3>{assignmentName}</h3>
          <p>{projectName}</p>
        </div>

        <nav className="mt-4">
          <ul className="flex flex-col">
            {sidebarItems.map((item) => {
              // Exact match for root preview; prefix match for sub-pages
              const isActive =
                item.href === `/preview/${projectId}`
                  ? pathname === `/preview/${projectId}`
                  : pathname.startsWith(item.href);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 h-[52px] px-6 transition-colors border-l-6
                      ${
                        isActive
                          ? "bg-primary01 border-primary03"
                          : "border-transparent hover:bg-neutral02/50"
                      }`}
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
      </div>

      <div className="mt-auto pb-2">
        <Link
          href={backHref}
          className="group flex items-center gap-2 h-[52px] p-6 hover:bg-neutral02/50 transition-colors"
        >
          <ArrowBackIcon className="text-neutral05 group-hover:text-black transition-colors" />
          <p className="text-neutral05 group-hover:text-black p2">
            Back to assignment
          </p>
        </Link>
      </div>
    </aside>
  );
};
