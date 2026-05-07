"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Breadcrumbs,
  Box,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Link from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import type { TestResultPageData, PlagiarismRow } from "./types";

interface Props {
  data: TestResultPageData | null;
  isLoading: boolean;
  error: string | null;
}

function getUniqueComparisons(rows: PlagiarismRow[] | null) {
  const byPair = new Map<string, PlagiarismRow>();

  for (const row of rows ?? []) {
    const s1 = (row.student1 || "").trim().toLowerCase();

    const s2 = (row.student2 || "").trim().toLowerCase();

    const key = [s1, s2].sort().join("::");

    const existing = byPair.get(key);

    if (!existing || row.avg_similarity > existing.avg_similarity) {
      byPair.set(key, row);
    }
  }

  return Array.from(byPair.values());
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-[#da291c]";
  if (score >= 60) return "bg-[#ffb300]";
  return "bg-[var(--color-success01)]";
}

function getStatusBadgeClass(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "success":
    case "passed":
    case "pass":
      return "bg-[var(--color-success01)] text-white";
    case "failed":
    case "fail":
    case "error":
      return "bg-[#da291c] text-white";
    case "running":
    case "pending":
    case "not run":
    case "not_run":
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

  const allPairs = useMemo(() => {
    if (!data) return [];
    return getUniqueComparisons(data.plagiarismData).sort(
      (a, b) => b.avg_similarity - a.avg_similarity,
    );
  }, [data]);

  const filteredPlagiarism = useMemo(() => {
    if (!searchQuery.trim()) return allPairs;
    const q = searchQuery.trim().toLowerCase();
    return allPairs.filter(
      (item) =>
        (item.student1 || "").toLowerCase().includes(q) ||
        (item.student2 || "").toLowerCase().includes(q),
    );
  }, [allPairs, searchQuery]);

  const averageSimilarity = useMemo(() => {
    if (allPairs.length === 0) return 0;
    return (
      allPairs.reduce((acc, curr) => acc + curr.avg_similarity, 0) /
      allPairs.length
    );
  }, [allPairs]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "var(--color-primary03)" }} />
        <Typography style={{ color: "var(--color-neutral05)" }}>
          Loading test results...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography style={{ color: "var(--color-accent04)" }}>
          {error || "Test result data unavailable."}
        </Typography>
      </Box>
    );
  }

  const testcaseStatus = String(data.testcaseResult?.status || "unknown");
  const testcasePassed = getCount(data.testcaseResult?.passed);
  const testcaseFailed = getCount(data.testcaseResult?.failed);
  const testcaseTotal = getCount(data.testcaseResult?.total);
  const testcaseRunId =
    typeof data.testcaseResult?.run_id === "string"
      ? data.testcaseResult.run_id
      : null;
  const testcaseCases = data.testcaseCases;
  const cyberLanguages = Array.isArray(data.cyberScanData?.languages)
    ? data.cyberScanData.languages.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const cyberIssuesFound = getCount(data.cyberScanData?.issues_found) ?? 0;
  const isCyberSummaryFallback = data.cyberScanSource === "summary";
  const totalTests = testcaseTotal ?? testcaseCases.length;
  const passedTests =
    testcasePassed ??
    testcaseCases.filter(
      (item) => item.status === "pass" || item.status === "passed",
    ).length;
  const failedTests =
    testcaseFailed ??
    testcaseCases.filter(
      (item) => item.status === "fail" || item.status === "failed",
    ).length;
  const showNoPlagiarismData = allPairs.length === 0;
  const showNoSearchMatches =
    searchQuery.trim().length > 0 &&
    filteredPlagiarism.length === 0 &&
    allPairs.length > 0;
  const avgColorClass = getScoreColor(averageSimilarity);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs className="my-6 mb-6">
        <Link href="/classroom">Home</Link>
        <span>{data.classroomName || "Classroom"}</span>
        <span>{data.assignmentTitle}</span>
        <span>{data.projectLabel}</span>
        <span style={{ color: "var(--color-black)", fontWeight: 500 }}>
          Test Result
        </span>
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
          boxShadow:
            "3px 3px 5px 1px rgb(0 0 0 / 0.1), 0 5px 5px -1px rgb(0 0 0 / 0.1)",
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
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>
              Result Test Case
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(testcaseStatus)}`}
            >
              {formatStatus(testcaseStatus)}
            </span>
          </div>
          <div
            className="mr-4 flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            {data.testcaseOutputUrl && (
              <a
                href={data.testcaseOutputUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary03)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary03)] no-underline transition-colors hover:bg-[var(--color-primary03)] hover:text-white"
              >
                <DownloadIcon sx={{ fontSize: 13 }} />
                output.xml
              </a>
            )}
            {data.testcaseLogUrl && (
              <a
                href={data.testcaseLogUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary03)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary03)] no-underline transition-colors hover:bg-[var(--color-primary03)] hover:text-white"
              >
                <DownloadIcon sx={{ fontSize: 13 }} />
                Download log
              </a>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <div className="flex flex-wrap gap-3 border-b border-[var(--color-neutral03)] px-6 py-4 bg-[#fafafa]">
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Total
              </div>
              <div className="text-lg font-semibold text-black">
                {totalTests}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Passed
              </div>
              <div className="text-lg font-semibold text-[var(--color-success02)]">
                {passedTests}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Failed
              </div>
              <div className="text-lg font-semibold text-[#da291c]">
                {failedTests}
              </div>
            </div>
            {testcaseRunId && (
              <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2 min-w-[220px]">
                <div className="text-xs uppercase tracking-wide text-neutral05">
                  Run ID
                </div>
                <div className="truncate text-sm font-medium text-black">
                  {testcaseRunId}
                </div>
              </div>
            )}
          </div>

          {testcaseCases.length === 0 ? (
            <div className="px-6 py-5 text-neutral05 space-y-2">
              <div>
                {String(
                  data.testcaseResult?.message ||
                    "No testcase details were generated for this submission.",
                )}
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[var(--color-neutral03)]">
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[28%]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Test Case
                  </th>
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[14%]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Status
                  </th>
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[12%]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Duration
                  </th>
                  <th
                    className="py-3 px-6 font-bold text-[15px]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {testcaseCases.map((item, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-[var(--color-neutral03)] ${isEven ? "bg-white" : "bg-[#eef6ff]"}`}
                    >
                      <td className="py-3 px-6 align-top">
                        <div className="font-medium text-[15px] text-black">
                          {item.name}
                        </div>
                        {(item.line || item.suiteName) && (
                          <div className="mt-1 text-xs text-neutral05">
                            {item.suiteName ? `${item.suiteName}` : ""}
                            {item.line
                              ? `${item.suiteName ? " - " : ""}line ${item.line}`
                              : ""}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 align-top">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(item.status)}`}
                        >
                          {formatStatus(item.status)}
                        </span>
                      </td>
                      <td className="py-3 px-6 align-top text-[15px] text-black">
                        {item.durationSeconds !== null
                          ? `${item.durationSeconds.toFixed(2)}s`
                          : "-"}
                      </td>
                      <td className="py-3 px-6 align-top text-[14px] text-black whitespace-pre-wrap break-words">
                        {item.message || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          boxShadow:
            "3px 3px 5px 1px rgb(0 0 0 / 0.1), 0 5px 5px -1px rgb(0 0 0 / 0.1)",
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
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>
              Result Cyber Security Test
            </h4>
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
              scan.json could not be loaded from the artifact endpoint, so this
              section is showing the saved database summary.
            </div>
          )}
          <div className="flex flex-wrap gap-3 border-b border-[var(--color-neutral03)] px-6 py-4 bg-[#fafafa]">
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Type
              </div>
              <div className="text-lg font-semibold text-black">
                {typeof data.cyberScanData?.type === "string"
                  ? data.cyberScanData.type
                  : "unknown"}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Issues Found
              </div>
              <div className="text-lg font-semibold text-black">
                {cyberIssuesFound}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-neutral03)] bg-white px-4 py-2 min-w-[220px]">
              <div className="text-xs uppercase tracking-wide text-neutral05">
                Languages
              </div>
              <div className="text-sm font-medium text-black">
                {cyberLanguages.length > 0
                  ? cyberLanguages.join(", ")
                  : "None detected"}
              </div>
            </div>
          </div>
          <div className="p-4 pt-3 max-h-[500px] overflow-y-auto">
            <pre
              className="font-mono text-[14px] leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: "var(--color-black)" }}
            >
              {JSON.stringify(
                data.cyberScanData ?? {
                  status: "missing",
                  message: "No scan.json artifact recorded yet.",
                },
                null,
                2,
              )}
            </pre>
          </div>
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
          boxShadow:
            "3px 3px 5px 1px rgb(0 0 0 / 0.1), 0 5px 5px -1px rgb(0 0 0 / 0.1)",
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
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>
              Result Plagiarism Test
            </h4>
            <div
              className={`flex items-center gap-2 ${avgColorClass} text-white px-3 py-1 rounded-[4px]`}
            >
              <span className="text-[13px] font-medium opacity-90">
                Average Similar Score
              </span>
              <span className="font-bold text-[15px]">
                {averageSimilarity.toFixed(2)}%
              </span>
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
              No assignment-level plagiarism comparisons are available yet. This
              section is populated only after plagiarism processing completes
              successfully for at least two submissions.
            </div>
          ) : showNoSearchMatches ? (
            <div className="px-6 py-5 text-neutral05">
              No compared student matches your search.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[var(--color-neutral03)]">
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[40%]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Student 1
                  </th>
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[40%]"
                    style={{ color: "var(--color-black)" }}
                  >
                    Student 2
                  </th>
                  <th
                    className="py-3 px-6 font-bold text-[15px] w-[20%] text-right"
                    style={{ color: "var(--color-black)" }}
                  >
                    Similar Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlagiarism.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const colorClass = getScoreColor(item.avg_similarity);
                  return (
                    <tr
                      key={`${item.student1}-${item.student2}-${index}`}
                      className={`border-b border-[var(--color-neutral03)] ${isEven ? "bg-white" : "bg-[#eef6ff]"}`}
                    >
                      <td
                        className="py-3 px-6 text-[15px]"
                        style={{ color: "var(--color-black)" }}
                      >
                        {item.student1}
                      </td>
                      <td
                        className="py-3 px-6 text-[15px]"
                        style={{ color: "var(--color-black)" }}
                      >
                        {item.student2}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex justify-end">
                          <div
                            className={`${colorClass} text-white font-bold px-3 py-1 rounded w-16 text-center text-[14px]`}
                          >
                            {Number(item.avg_similarity).toFixed(2)}%
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
