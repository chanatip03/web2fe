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
import DownloadIcon from "@mui/icons-material/Download";
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

  const isCyberSummaryFallback = data.cyberScanSource === "summary";

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
            ".MuiAccordionSummary-content": {
              justifyContent: "space-between",
              alignItems: "center",
            },
          }}
        >
          <div className="flex items-center gap-3">
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Cyber Security Test</h4>
            <span className="rounded-full bg-[var(--color-neutral03)] px-3 py-1 text-xs font-semibold text-[var(--color-black)]">
              Source: {data.cyberScanSource}
            </span>
          </div>
          {data.cyberScanUrl && (
            <div className="mr-4" onClick={(event) => event.stopPropagation()}>
              <a
                href={data.cyberScanUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary03)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary03)] no-underline transition-colors hover:bg-[var(--color-primary03)] hover:text-white"
              >
                <DownloadIcon sx={{ fontSize: 13 }} />
                Download scan.json
              </a>
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {isCyberSummaryFallback && (
            <div className="border-b border-[var(--color-neutral03)] bg-[#fff8e1] px-6 py-3 text-sm text-black">
              scan.json could not be loaded from the artifact endpoint, so this section is showing the saved database summary.
            </div>
          )}
          <div className="p-4 pt-3 max-h-[500px] overflow-y-auto">
          <pre className="font-mono text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-black)" }}>
            {JSON.stringify(data.cyberScanData ?? { status: "missing", message: "No cybersecurity result recorded yet." }, null, 2)}
          </pre>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
