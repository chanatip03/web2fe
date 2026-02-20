"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  Button,
  Chip,
  Switch,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateAssignmentModal from "./modal/createAssignmentModal";
import { IProjectType } from "@/domain/project";
import { Classroom } from "@/domain/classroom";

interface IAssignment {
  id: number;
  name: string;
  detail: string;
  isGroup: boolean;
  isPublic: boolean;
  startDate: Date;
  dueDate: Date;
  projectType?: IProjectType;
  classroom?: Classroom;
}

interface AssignmentListProps {
  assignments: IAssignment[];
}

const mockAssignments: IAssignment[] = [
  {
    id: 1,
    name: "Lab 1 List Form",
    detail: "Create list form using React",
    startDate: new Date("2025-03-01T11:00:00"),
    dueDate: new Date("2025-03-04T12:00:00"),
    isGroup: false,
    isPublic: true,
    projectType: {
      id: 2,
      name: "Frontend",
    },
    classroom: {
      id: "1",
      name: "Web Programming II",
      description: "This is a web programming class.",
      semester: "2024-1",
      code: "XCYGI22",
      teacher: {
        id: "1",
        certificateUrl: "https://example.com/cert.pdf",
        isApproved: true,
        user: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          academy: "kmutt"
        },
      }

    },
  },
  {
    id: 2,
    name: "HW Flexbox and Grid",
    detail: "Practice Flexbox and CSS Grid",
    startDate: new Date("2025-03-14T11:01:00"),
    dueDate: new Date("2025-03-19T12:00:00"),
    isGroup: true,
    isPublic: true,
    projectType: {
      id: 1,
      name: "Full-stack",
    },
    classroom: {
      id: "1",
      name: "Web Programming II",
      description: "This is a web programming class.",
      semester: "2024-1",
      code: "XCYGI22",
      teacher: {
        id: "1",
        certificateUrl: "https://example.com/cert.pdf",
        isApproved: true,
        user: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          academy: "kmutt"
        },
      }

    },
  },
  {
    id: 3,
    name: "Final Project",
    detail: "Build fullstack web application",
    startDate: new Date("2025-04-07T11:01:00"),
    dueDate: new Date("2025-04-09T12:00:00"),
    isGroup: true,
    isPublic: true,
    projectType: {
      id: 1,
      name: "Backend",
    },
     classroom: {
      id: "1",
      name: "Web Programming II",
      description: "This is a web programming class.",
      semester: "2024-1",
      code: "XCYGI22",
      teacher: {
        id: "1",
        certificateUrl: "https://example.com/cert.pdf",
        isApproved: true,
        user: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          academy: "kmutt"
        },
      }

    },
  },
  {
    id: 4,
    name: "HW Express",
    detail: "Build REST API with Express",
    startDate: new Date("2025-04-12T11:01:00"),
    dueDate: new Date("2026-04-15T12:00:00"),
    isGroup: false,
    isPublic: false,
    projectType: {
      id: 2,
      name: "Frontend",
    },
    classroom: {
      id: "1",
      name: "Web Programming II",
      description: "This is a web programming class.",
      semester: "2024-1",
      code: "XCYGI22",
      teacher: {
        id: "1",
        certificateUrl: "https://example.com/cert.pdf",
        isApproved: true,
        user: {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          academy: "kmutt"
        },
      }

    },
  }
];

const checkOverdue = (date: string | Date) =>
  new Date(date).getTime() < Date.now();


const AssignmentListPage = () => {
  const [assignmentList, setAssignmentList] = useState<IAssignment[]>(mockAssignments);
  const [openCreate, setOpenCreate] = useState(false);

  const handleToggle = (id: number) => {
    setAssignmentList((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isPublic: !a.isPublic } : a
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs separator="/">
          <Link href="/classroom/listclassroom">Home</Link>
          <span>{assignmentList[0]?.classroom?.name}</span>
          <span className="text-black font-medium">Assignment</span>
        </Breadcrumbs>
      </div>


      <div className="flex items-center justify-between mb-6">
        <h1>Assignment</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create Assignment
        </Button>
      </div>


      <div className="grid grid-cols-13 mb-3 px-4">
        <div className="col-span-4">
          <h5>Assignment Name</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Publish Date</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Due Date</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Submitted</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Publish</h5>
        </div>
        <div className="col-span-1"></div>
      </div>

      <div className="flex flex-col gap-2">
        {assignmentList.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-13 items-center shadow-md border border-neutral02 rounded-md p-4"
          >
            <div className="col-span-4 flex flex-col gap-2">
              <h5>{item.name}</h5>

              <div className="flex gap-2">
                <Chip
                  label={
                    item.isGroup ? "Group" : "Individual"
                  }
                  size="small"
                  sx={{
                    border: "1px solid var(--color-primary03)",
                    color: "var(--color-primary03)",
                    backgroundColor: "var(--color-primary01)",
                    borderRadius: 0.5,
                  }}
                />
                <Chip
                  label={item.projectType?.name}
                  size="small"
                  sx={{
                    border: "1px solid var(--color-primary03)",
                    color: "var(--color-primary03)",
                    backgroundColor: "var(--color-primary01)",
                    borderRadius: 0.5,
                  }}
                />
              </div>
            </div>

            <div className="col-span-2 flex justify-center">
              <p className="p2 font-semibold">
                {new Date(item.startDate).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="col-span-2 flex justify-center">
              <p
                className={`p2 font-semibold ${checkOverdue(item.dueDate)
                  ? "text-red-600"
                  : "text-black"
                  }`}
              >
                {new Date(item.dueDate).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="col-span-2 flex justify-center">
              <p className="p2 font-bold text-primary03">
                20/50
              </p>
            </div>

            <div className="col-span-2 flex justify-center gap-2">
              <Switch
                checked={item.isPublic}
                onChange={() =>
                  handleToggle(item.id)
                }
                sx={{
                  transform: "scale(1.2)",//switch ไม่มี size large จึงใช้อันนี้แทน เพื่อขยายขนาด 
                }}
              />
            </div>

            <div className="col-span-1 flex justify-start gap-2">
              <IconButton
                size="small"
                color="primary"
              >
                <EditIcon fontSize="medium" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <CreateAssignmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default AssignmentListPage;