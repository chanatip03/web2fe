"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs, Accordion, AccordionSummary, AccordionDetails, Box, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function TestResult_full() {
  const [cyberScanData, setCyberScanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock fetching data from backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        // FIXME: Replace this setTimeout with your actual backend API call 
        // const response = await fetch('/api/test-results-full');
        // const data = await response.json();
        
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulating the JSON response from your API
        setCyberScanData({
          project: "student-webapp",
          file: "Dockerfile",
          baseImage: "node:16-alpine",
          scanTime: "2025-12-03T22:15:00Z",
          ok: false,
          summary: { totalIssues: 1 },
        });

      } catch (error) {
        console.error("Error fetching test results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading || !cyberScanData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
        <CircularProgress sx={{ color: 'var(--color-primary03)' }} />
        <Typography style={{ color: "var(--color-neutral05)" }}>Loading test results...</Typography>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumbs className="my-6 mb-6">
        <Link href="/classroom">Home</Link>
        <span>mockup classroom</span>
        <Link href="/assignment">Assignment</Link>
        <span>mockup assignment</span>
        <span>mockup_group_name</span>
        <span style={{ color: "var(--color-black)", fontWeight: 500 }}>Test Result</span>
      </Breadcrumbs>

      {/* Cyber Security Test Result Card */}
      <Accordion 
        defaultExpanded 
        disableGutters 
        elevation={0}
        sx={{
          border: '1px solid var(--color-neutral03)',
          borderRadius: '8px !important',
          '&:before': { display: 'none' },
          overflow: 'hidden',
          boxShadow: '3px 3px 5px 1px rgb(0 0 0 / 0.1), 0 5px 5px -1px rgb(0 0 0 / 0.1)'
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-black)' }} />}
          sx={{
            borderBottom: '1px solid var(--color-neutral03)',
            px: 3,
            py: 1
          }}
        >
          <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Cyber Security Test</h4>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 4, pt: 3, maxHeight: '500px', overflowY: 'auto' }}>
          <pre className="font-mono text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-black)" }}>
            {JSON.stringify(cyberScanData, null, 2)}
          </pre>
        </AccordionDetails>
      </Accordion>

    </div>
  );
}