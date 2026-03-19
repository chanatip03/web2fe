"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs, Box, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Define the interface for your backend payload
export interface StudentAssignment {
  id: number;
  title: string;
  score?: number;
  sendDate?: string;
  feedback?: string;
  status: "graded" | "waiting" | "missing";
}

export default function StudentScorebookPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace this timeout with your actual fetch call to the backend
        // const response = await fetch('/api/student/scores');
        // if (!response.ok) throw new Error("Failed to fetch score data");
        // const data = await response.json();
        // setAssignments(data.assignments);

        // --- Mocking Backend Connection ---
        setTimeout(() => {
          setAssignments([
            {
              id: 1,
              title: "Lab 1 List Form",
              score: 10,
              sendDate: "9 April 2025 at 11.01",
              feedback:
                "Software engineering principles. Ethics for software engineering. Process models and software evolution. System development cycle. System feasibility study. Planning of software development project. System analysis methodologies and tools. System design. System development",
              status: "graded",
            },
            {
              id: 2,
              title: "HW Flexbox and Grid",
              score: 8,
              sendDate: "16 April 2025 at 23.59",
              feedback: "Good layout, but the mobile view could use some adjustments.",
              status: "graded",
            },
            {
              id: 3,
              title: "Final Project",
              status: "waiting",
            },
          ]);
          setIsLoading(false);
        }, 1000);
        // ----------------------------------

      } catch (err: any) {
        setError(err.message || "An error occurred");
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className=" flex flex-col gap-6 w-full">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start justify-start gap-2 mb-2">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link href="/classroom/listclassroom">Home</Link>
          <Link href="/classroom/listclassroom">Web programming</Link>
          <span className="text-black">Score and feedback</span>
        </Breadcrumbs>
      </div>

      <h1 className="mb-4">Score and Feedback</h1>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Box sx={{ p: 3, bgcolor: 'var(--color-accent01)', borderRadius: '8px', color: 'var(--color-accent04)' }}>
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
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5, color: "var(--color-black)" }}>
                      {assignment.title}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-neutral05)" }}>
                      Waiting for Professor's Reviews
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
                    expandIcon={<ExpandMoreIcon sx={{ color: "var(--color-black)" }} />}
                    sx={{
                      p: 3,
                      pb: 1.5,
                      "& .MuiAccordionSummary-content": {
                        flexDirection: "column",
                        m: 0,
                      },
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "var(--color-black)" }}>
                      {assignment.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "var(--color-black)" }}>Score :</Typography>
                      <Typography sx={{ fontWeight: 700, color: "var(--color-primary03)", fontSize: "1.1rem" }}>
                        {assignment.score}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "var(--color-black)" }}>Send Date :</Typography>
                      <Typography sx={{ color: "var(--color-neutral05)" }}>{assignment.sendDate}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, color: "var(--color-black)" }}>Feedback:</Typography>
                      <Typography sx={{ color: "var(--color-neutral05)", lineHeight: 1.6 }}>
                        {assignment.feedback}
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
