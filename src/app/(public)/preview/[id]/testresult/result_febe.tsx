"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs, Accordion, AccordionSummary, AccordionDetails, OutlinedInput, InputAdornment, Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import type { TestResultPageData } from "./types";

interface Props {
  data: TestResultPageData | null;
  isLoading: boolean;
  error: string | null;
}

function getUniqueComparisons(rows: TestResultPageData["plagiarismData"]) {
  const byPair = new Map<string, TestResultPageData["plagiarismData"][number]>();
  for (const row of rows) {
    const key = [row.student1, row.student2].sort().join("::");
    if (!byPair.has(key)) {
      byPair.set(key, row);
    }
  }
  return Array.from(byPair.values());
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case "success":
    case "passed":
      return "bg-[var(--color-success01)] text-white";
    case "failed":
    case "error":
      return "bg-[#da291c] text-white";
    case "running":
    case "pending":
      return "bg-[#ffb300] text-white";
    default:
      return "bg-[var(--color-neutral03)] text-[var(--color-black)]";
  }
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/[_-]/g, " ");
}

function getCount(value: unknown) {
  return typeof value === "number" ? value : null;
}

export default function TestResultFeBe({ data, isLoading, error }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const projectComparisons = useMemo(() => {
    if (!data) return [];

    return getUniqueComparisons(data.plagiarismData)
      .filter((item) => item.student1 === data.projectLabel || item.student2 === data.projectLabel)
      .map((item) => ({
        name: item.student1 === data.projectLabel ? item.student2 : item.student1,
        score: item.avg_similarity,
      }));
  }, [data]);

  const filteredPlagiarism = useMemo(() => {
    return projectComparisons.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projectComparisons, searchQuery]);

  const averageSimilarity = useMemo(() => {
    if (projectComparisons.length === 0) return 0;
    return projectComparisons.reduce((acc, curr) => acc + curr.score, 0) / projectComparisons.length;
  }, [projectComparisons]);

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

  const testcaseStatus = String(data.testcaseResult?.status || "unknown");
  const testcasePassed = getCount(data.testcaseResult?.passed);
  const testcaseFailed = getCount(data.testcaseResult?.failed);
  const testcaseTotal = getCount(data.testcaseResult?.total);
  const testcaseRunId = typeof data.testcaseResult?.run_id === "string" ? data.testcaseResult.run_id : null;
  const showNoPlagiarismData = projectComparisons.length === 0;
  const showNoSearchMatches = searchQuery.trim().length > 0 && filteredPlagiarism.length === 0 && projectComparisons.length > 0;

  let avgColorClass = "bg-[var(--color-success01)]";
  if (averageSimilarity >= 80) avgColorClass = "bg-[#da291c]";
  else if (averageSimilarity >= 60) avgColorClass = "bg-[#ffb300]";

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
          <div className="flex items-center gap-3">
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Test Case</h4>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(testcaseStatus)}`}>
              {formatStatus(testcaseStatus)}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <div className="flex flex-wrap gap-3 border-b border-[var(--color-neutral03)] px-6 py-4 bg-[#fafafa]">
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">Total</div>
              <div className="text-lg font-semibold text-black">{testcaseTotal ?? "-"}</div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">Passed</div>
              <div className="text-lg font-semibold text-[var(--color-success02)]">{testcasePassed ?? "-"}</div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">Failed</div>
              <div className="text-lg font-semibold text-[#da291c]">{testcaseFailed ?? "-"}</div>
            </div>
            {testcaseRunId && (
              <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2 min-w-[220px]">
                <div className="text-xs uppercase tracking-wide text-neutral05">Run ID</div>
                <div className="truncate text-sm font-medium text-black">{testcaseRunId}</div>
              </div>
            )}
          </div>
          {data.testcaseLogUrl ? (
            <iframe
              src={data.testcaseLogUrl}
              title="Robot Framework Log"
              style={{ width: "100%", height: "500px", border: "none", display: "block" }}
            />
          ) : (
            <div className="px-6 py-5 text-neutral05 space-y-2">
              <div>{String(data.testcaseResult?.message || "No testcase log artifact was generated for this submission.")}</div>
              {testcaseStatus === "failed" && (
                <div className="text-sm text-[#da291c]">
                  The testcase run finished with failures. Open the project artifacts if you need the raw Robot Framework report files.
                </div>
              )}
            </div>
          )}
        </AccordionDetails>
      </Accordion>

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
          <div className="flex items-center gap-4">
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Plagiarism Test</h4>
            <div className={`flex items-center gap-2 ${avgColorClass} text-white px-3 py-1 rounded-[4px]`}>
              <span className="text-[13px] font-medium opacity-90">Average Similar Score</span>
              <span className="font-bold text-[15px]">{averageSimilarity.toFixed(2)}%</span>
            </div>
          </div>
          <div className="mx-8" onClick={(event) => event.stopPropagation()}>
            <OutlinedInput
              size="small"
              placeholder="Search name"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--color-neutral04)" }} />
                </InputAdornment>
              }
              sx={{
                width: 220,
                backgroundColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-neutral03)",
                },
              }}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {showNoPlagiarismData ? (
            <div className="px-6 py-5 text-neutral05">
              No assignment-level plagiarism comparisons are available yet. This section is populated only after plagiarism processing completes successfully for at least two submissions.
            </div>
          ) : showNoSearchMatches ? (
            <div className="px-6 py-5 text-neutral05">No compared student matches your search.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[var(--color-neutral03)]">
                  <th className="py-3 px-6 font-bold text-[15px] w-2/3" style={{ color: "var(--color-black)" }}>Compared With</th>
                  <th className="py-3 px-6 font-bold text-[15px] w-1/3 text-right" style={{ color: "var(--color-black)" }}>Similar Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlagiarism.map((item, index) => {
                  const isEven = index % 2 === 0;
                  let colorClass = "bg-[var(--color-success01)]";
                  if (item.score >= 80) colorClass = "bg-[#da291c]";
                  else if (item.score >= 60) colorClass = "bg-[#ffb300]";
                  return (
                    <tr key={`${item.name}-${index}`} className={`border-b border-[var(--color-neutral03)] ${isEven ? "bg-white" : "bg-[#eef6ff]"}`}>
                      <td className="py-3 px-6 text-[15px]" style={{ color: "var(--color-black)" }}>{item.name}</td>
                      <td className="py-3 px-6">
                        <div className="flex justify-end">
                          <div className={`${colorClass} text-white font-bold px-3 py-1 rounded w-16 text-center text-[14px]`}>
                            {Number(item.score).toFixed(2)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
