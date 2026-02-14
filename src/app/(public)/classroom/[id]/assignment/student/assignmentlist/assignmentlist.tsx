"use client";

import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link"

/* ================= TYPES (SQL) ================= */

export interface Assignment {
  id: number;
  name: string;
  detail: string;
  startDate: string;
  dueDate: string;
  isGroup: boolean;
  testcaseUrl: string;
  isPublic: boolean;
  projectTypeId: number;
  projecrLanguage: string;
  classroomId: number;
  createdDate: string;
  updatedDate: string;
  deletedDate: string | null;
}

interface Props {
  apiBase: string;
}

type AssignmentStatus = "submitted" | "late" | "not_submitted";

/* ================= MOCK ================= */

const mockAssignments: Assignment[] = [
  {
    id: 1,
    name: "Lab 1 List Form",
    detail: "",
    startDate: "2025-03-01T11:00:00",
    dueDate: "2025-03-04T12:00:00",
    isGroup: false,
    testcaseUrl: "",
    isPublic: true,
    projectTypeId: 1,
    projecrLanguage: "TS",
    classroomId: 1,
    createdDate: "",
    updatedDate: "",
    deletedDate: null,
  },
  {
    id: 2,
    name: "HW Flexbox and Grid",
    detail: "",
    startDate: "2025-03-14T11:01:00",
    dueDate: "2025-03-14T12:00:00",
    isGroup: false,
    testcaseUrl: "",
    isPublic: true,
    projectTypeId: 1,
    projecrLanguage: "CSS",
    classroomId: 1,
    createdDate: "",
    updatedDate: "",
    deletedDate: null,
  },
  {
    id: 3,
    name: "Final Project",
    detail: "",
    startDate: "2025-04-07T11:00:00",
    dueDate: "2026-04-09T11:01:00",
    isGroup: true,
    testcaseUrl: "",
    isPublic: true,
    projectTypeId: 2,
    projecrLanguage: "Fullstack",
    classroomId: 1,
    createdDate: "",
    updatedDate: "",
    deletedDate: null,
  },
];

/* ================= STATUS ================= */
function getStatus(a: Assignment): AssignmentStatus {
  const now = dayjs();
  if (now.isAfter(dayjs(a.dueDate))) return "late";
  return "submitted"; // mock
}

/* ================= STATUS BUTTON ================= */
function StatusButton({ status }: { status: AssignmentStatus }) {
  if (status === "submitted") {
    return (
      <Button variant="contained" color="primary">
        Submitted
      </Button>
    );
  }

  if (status === "late") {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#F4B400",
          color: "#fff",
          "&:hover": { backgroundColor: "#d89b00" },
        }}
      >
        Late Submitted
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      disabled
      sx={{
        backgroundColor: "var(--color-neutral03)",
        color: "white",
      }}
    >
      Not Submitted
    </Button>
  );
}

/* ================= COMPONENT ================= */
export default function AssignmentList({ apiBase }: Props) {
  const assignments = mockAssignments.filter(
    (a) => a.isPublic && !a.deletedDate
  );

return (
  <>
    <div className="w-full px-25 py-8 bg-neutral01">

      {/* Breadcrumb */}
      <div className="text-sm mb-6">
        <Link
          href="/classroom/listclassroom"
          className="text-neutral04 hover:text-primary03 transition"
        >
          Home
        </Link>
        <span className="mx-2 text-neutral04">/</span>
        <span className="text-neutral04">Mockup data</span>
        <span className="mx-2 text-neutral04">/</span>
        <span className="font-semibold text-foreground">Assignment</span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-foreground font-bold">Assignment</h1>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8 text-base">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-green-600"></div>
          <span className="text-neutral06">On-time</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-yellow-500"></div>
          <span className="text-neutral06">Late</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-gray-400"></div>
          <span className="text-neutral06">Not Submit</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-lg font-semibold text-foreground mb-4">
        <div className="col-span-5">Assignment Name</div>
        <div className="col-span-3">Publish Date</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Status</div>
      </div>

      {/* Assignment List */}
      <div className="space-y-5">
        {assignments.map((item) => {
          const status = getStatus(item);
          const isLate = status === "late";

          return (
          <Link
              key={item.id}
              href={`/assignment/${item.id}/student/submit`}
              className="block"
            >
              <div
                key={item.id}
                className="grid grid-cols-12 items-center bg-white rounded-xl border border-neutral03 px-6 py-6 shadow-xl
                transition-all duration-200 ease-in-out
                hover:-translate-y-1 hover:shadow-2xl hover:border-primary03 "
              >
                {/* Name + Type */}
                <div className="col-span-5">
                  <p className="font-semibold text-foreground mb-0.5">
                    {item.name}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-md border ${
                      item.isGroup
                        ? "border-secondary03 text-secondary03"
                        : "border-primary03 text-primary03"
                    }`}
                  >
                    {item.isGroup ? "Group" : "Individual"}
                  </span>
                </div>

                {/* Publish Date */}
                <div className="col-span-3 text-neutral06 text-sm">
                  {dayjs(item.startDate).format("D MMMM YYYY [at] HH.mm")}
                </div>

                {/* Due Date */}
                <div
                  className={`col-span-2 text-sm ${
                    isLate ? "text-red-600" : "text-neutral06"
                  }`}
                >
                  {dayjs(item.dueDate).format("D MMMM YYYY [at] HH.mm")}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div
                    className={`text-xs font-semibold px-4 py-2 rounded-md text-center w-[130px]
                      ${
                        status === "submitted"
                          ? "bg-green-600 text-white"
                          : status === "late"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-400 text-white"
                      }
                    `}
                  >
                    {status === "submitted"
                      ? "Submitted"
                      : status === "late"
                      ? "Late Submitted"
                      : "Not Submitted"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </>
);

}
