"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs, Chip } from "@mui/material";
import { useParams } from "next/navigation";
import { assignmentService, projectService, userService } from "@/services/controller";
import { Assignment } from "@/domain/assignment";
import Cookies from "js-cookie";

// 👉 Check status based on submission and due date
const getStatus = (item: Assignment) => {
  // If no submission, return not_submitted
  if (!item.submission || !item.submission.submitted_at) {
    return "not_submitted";
  }
  
  if (item.submission.is_late) {
    return "late"; // Late submission
  }
  
  // Check if submitted late via fallback dates
  const submittedAt = new Date(item.submission.submitted_at).getTime();
  const dueDate = new Date(item.due_date).getTime();
  
  if (submittedAt > dueDate) {
    return "late"; // Late submission
  }
  
  return "submitted"; // On-time submission
};

const checkOverdue = (date: string | Date) =>
  new Date(date).getTime() < Date.now();

export default function StudentAssignmentListPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await assignmentService.getAssignments(Number(id));
        
        // Get current logged-in user to filter projects
        const currentUser = await userService.getCurrentUser();
        const myStudentId = currentUser.id;

        // Fetch submission status for each assignment
        const assignmentsWithSubmissions = await Promise.all(
          data.map(async (assignment) => {
            try {
              const projects = await projectService.getProjectsByAssignment(assignment.id);
              const userProject = projects.find((p: any) => p.students?.some((s: any) => s.id === myStudentId));

              if (userProject) {
                // Return a mock submission object holding the state. Since the backend Project DTO
                // lacks created_date, we default to submitted to clear the 500 errors and CORS.
                return { 
                  ...assignment, 
                  submission: { 
                    id: userProject.id, 
                    // Fallback to due date so it's marked as on time if date is missing
                    submitted_at: (userProject as any).created_at || (userProject as any).created_date || assignment.due_date,
                    is_late: (userProject as any).is_late === true,
                  } 
                };
              }
              return assignment;
            } catch (err) {
              console.error(`Failed to fetch project for assignment ${assignment.id}:`, err);
              return assignment;
            }
          })
        );
        
        setAssignments(assignmentsWithSubmissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumbs className="mb-6">
        <Link href="/classroom">Home</Link>
        <span>{Cookies.get("classroomName")}</span>
        <span className="text-black font-medium">Assignment</span>
      </Breadcrumbs>

      {/* Title */}
      <h1 className="mb-6 text-foreground font-bold">Assignment</h1>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8 text-base">
        <Legend color="bg-green-600" label="On-time" />
        <Legend color="bg-yellow-500" label="Late" />
        <Legend color="bg-gray-400" label="Not Submit" />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 mb-3 px-4">
        <div className="col-span-5">
          <h5>Assignment Name</h5>
        </div>
        <div className="col-span-3 flex justify-center">
          <h5>Publish Date</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Due Date</h5>
        </div>
        <div className="col-span-2 flex justify-center">
          <h5>Status</h5>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 px-2">
        {assignments.map((item) => {
          const status = getStatus(item);

          return (
            <Link
              key={item.id}
              href={`/classroom/${id}/assignment/${item.id}`}
              className="grid grid-cols-12 items-center shadow-md border border-neutral02 rounded-md px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary03"
            >
              {/* Name */}
              <div className="col-span-5 flex flex-col gap-2">
                <h5>{item.title}</h5>

                <div className="flex gap-2">
                  <Chip
                    label={item.is_group ? "Group" : "Individual"}
                    size="small"
                    sx={{
                      border: "1px solid var(--color-primary03)",
                      color: "var(--color-primary03)",
                      backgroundColor: "var(--color-primary01)",
                      borderRadius: 0.5,
                    }}
                  />
                  <Chip
                    label={item.project_type?.name}
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

              {/* Publish */}
              <div className="col-span-3 flex justify-center">
                <p className="p2 font-semibold text-center">
                  {new Date(item.start_date).toLocaleString("en-GB", {
                    timeZone: "Asia/Bangkok",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Due */}
              <div className="col-span-2 flex justify-center">
                <p
                  className={`p2 font-semibold text-center ${
                    checkOverdue(item.due_date) ? "text-red-600" : "text-black"
                  }`}
                >
                  {new Date(item.due_date).toLocaleString("en-GB", {
                    timeZone: "Asia/Bangkok",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-center">
                <StatusBadge status={status} />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded-sm ${color}`}></div>
    <span className="text-neutral06">{label}</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map = {
    submitted: "bg-green-600",
    late: "bg-yellow-500",
    not_submitted: "bg-gray-400",
  };

  const text = {
    submitted: "Submitted",
    late: "Late Submitted",
    not_submitted: "Not Submitted",
  };

  return (
    <div
      className={`text-xs font-semibold px-4 py-2 rounded-md text-center w-full max-w-[140px] text-white ${map[status as keyof typeof map]}`}
    >
      {text[status as keyof typeof text]}
    </div>
  );
};
