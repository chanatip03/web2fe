"use client";
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarProfessorItems = [
    {
        name: "Syllabus",
        href: "/professor/",
        icon: <BookOutlinedIcon />,
    },
    {
        name: "Assignment",
        href: "/professor/",
        icon: <AssignmentOutlinedIcon />,
    },
    {
        name: "Student",
        href: "/professor/",
        icon: <GroupsOutlinedIcon />,
    },
    {
        name: "Scorebook",
        href: "/professor/",
        icon: <EmojiEventsOutlinedIcon />,
    },
    {
        name: "setting",
        href: "/professor/",
        icon: <SettingsOutlinedIcon />,
    },

];

export const SidebarProfessor = () => {
    const pathname = usePathname();
    return (
        <aside className="w-[260px] h-screen bg-white border-r border-neutral02 ">
            <div className="bg-secondary04 text-white h-[145px] flex items-center px-4">
                <h2>WEB<br />PROGRAMMING</h2>
            </div>

            <nav className="mt-4">
                <ul className="flex flex-col">
                    {sidebarProfessorItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center gap-3 h-[52px] px-6 transition-colors border-l-6
                                    ${isActive
                                            ? "bg-primary01 border-primary03"
                                            : "border-transparent hover:bg-neutral02/50"
                                        }
                                    `}
                                >
                                    <span
                                        className={`transition-colors ${isActive
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
}
