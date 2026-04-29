"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { TestResultPageData } from "./types";

interface Props {
  data: TestResultPageData | null;
  isLoading: boolean;
  error: string | null;
}

export default function TestResultFull({ data, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh", gap: 2 }}>
        <CircularProgress sx={{ color: "var(--color-primary03)" }} />
        <Typography style={{ color: "var(--color-neutral05)" }}>Loading test results...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography style={{ color: "var(--color-accent04)" }}>{error || "Test result data unavailable."}</Typography>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs className="my-6 mb-6">
        <Link href="/classroom">Home</Link>
        <span>{data.classroomName || "Classroom"}</span>
        <span>{data.assignmentTitle}</span>
        <span>{data.projectLabel}</span>
        <span style={{ color: "var(--color-black)", fontWeight: 500 }}>Test Result</span>
      </Breadcrumbs>

      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid var(--color-neutral03)",
          borderRadius: "8px !important",
          "&:before": { display: "none" },
          overflow: "hidden",
          boxShadow: "3px 3px 5px 1px rgb(0 0 0 / 0.1), 0 5px 5px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "var(--color-black)" }} />}
          sx={{
            borderBottom: "1px solid var(--color-neutral03)",
            px: 3,
            py: 1,
          }}
        >
          <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Cyber Security Test</h4>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 4, pt: 3, maxHeight: "500px", overflowY: "auto" }}>
          <pre className="font-mono text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-black)" }}>
            {JSON.stringify(data.cyberScanData ?? { status: "missing", message: "No cybersecurity result recorded yet." }, null, 2)}
          </pre>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}