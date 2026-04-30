"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  assignmentService,
  projectService,
  userService,
} from "@/services/controller";

export interface StudentAssignment {
  id: number;
  title: string;
  score?: number | null;
  sendDate?: string;
  feedback?: string | null;
  status: "graded" | "waiting" | "missing";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StudentScorebookPage() {
  const { id: classroomId } = useParams();
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classroomId) return;

    const fetchScores = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching data for classroom:", classroomId);

        // 1. Get current logged-in user profile (Must be StudentResponse)
        const currentUser = await userService.getCurrentUser();
        const myStudentId = currentUser.id;

        // 2. Fetch all assignments in this classroom
        const classAssignments = await assignmentService.getAssignments(
          Number(classroomId),
        );

        // 3. Loop and fetch projects, tracking down the matching one
        const mappedData: StudentAssignment[] = await Promise.all(
          classAssignments.map(async (assign) => {
            let userProject = null;
            try {
              const projects = await projectService.getProjectsByAssignment(
                assign.id,
              );
              // Find the project that includes my student ID
              userProject = projects.find((p) =>
                p.students?.some((s) => s.id === myStudentId),
              );
            } catch {
              userProject = null; // No projects / error → implies missing
            }

            if (!userProject) {
              return {
                id: assign.id,
                title: assign.title,
                status: "missing" as const,
              };
            }

            // score != null catches both null and undefined
            const isGraded = userProject.score != null;
            return {
              id: assign.id,
              title: assign.title,
              score: userProject.score,
              feedback: userProject.feedback,
              sendDate: userProject.created_date
                ? formatDate(userProject.created_date)
                : undefined,
              status: isGraded ? ("graded" as const) : ("waiting" as const),
            };
          }),
        );

        setAssignments(mappedData);
      } catch (err: any) {
        setError(err.message || "An error occurred fetching your scorebook");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [classroomId]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start justify-start gap-2 mb-2">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link href="/classroom">Home</Link>
          <span>{Cookies.get("classroomName")}</span>
          <span className="text-black">Score and feedback</span>
        </Breadcrumbs>
      </div>

      <h1 className="mb-4">Score and Feedback</h1>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Box
          sx={{
            p: 3,
            bgcolor: "var(--color-accent01)",
            borderRadius: "8px",
            color: "var(--color-accent04)",
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Content State */}
      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {assignments.length === 0 ? (
            <Typography>No assignments found.</Typography>
          ) : (
            assignments.map((assignment, index) => {
              if (assignment.status === "missing") {
                return (
                  <Box
                    key={assignment.id}
                    sx={{
                      backgroundColor: "var(--color-neutral01)",
                      border: "1px dashed var(--color-neutral04)",
                      borderRadius: "8px",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          color: "var(--color-neutral04)",
                        }}
                      >
                        {assignment.title}
                      </Typography>
                      <Chip
                        label="Missing Submission"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                );
              }

              if (assignment.status === "waiting") {
                return (
                  <Box
                    key={assignment.id}
                    sx={{
                      backgroundColor: "var(--color-neutral02)",
                      border: "1px solid var(--color-neutral03)",
                      borderRadius: "8px",
                      p: 3,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "var(--color-black)",
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    <Typography
                      sx={{ fontWeight: 600, color: "var(--color-neutral05)" }}
                    >
                      Waiting for Professor&apos;s Reviews
                    </Typography>
                  </Box>
                );
              }

              return (
                <Accordion
                  key={assignment.id}
                  defaultExpanded={index === 0}
                  sx={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: "8px !important",
                    border: "1px solid var(--color-neutral03)",
                    "&:before": { display: "none" },
                    overflow: "hidden",
                    mb: "0 !important",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: "var(--color-black)" }} />
                    }
                    sx={{
                      p: 3,
                      pb: 1.5,
                      "& .MuiAccordionSummary-content": {
                        flexDirection: "column",
                        m: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "var(--color-black)",
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                    >
                      <Typography
                        sx={{ fontWeight: 700, color: "var(--color-black)" }}
                      >
                        Score :
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "var(--color-primary03)",
                          fontSize: "1.1rem",
                        }}
                      >
                        {assignment.score}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 3,
                      pb: 3,
                      pt: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                    >
                      <Typography
                        sx={{ fontWeight: 700, color: "var(--color-black)" }}
                      >
                        Send Date :
                      </Typography>
                      <Typography sx={{ color: "var(--color-neutral05)" }}>
                        {assignment.sendDate}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 700, color: "var(--color-black)" }}
                      >
                        Feedback:
                      </Typography>
                      <Typography
                        sx={{
                          color: "var(--color-neutral05)",
                          lineHeight: 1.6,
                        }}
                      >
                        {assignment.feedback || "-"}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
