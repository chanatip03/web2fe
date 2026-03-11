"use client";

import { Breadcrumbs, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cyberScanData from "./cyberscan.json";

export default function TestResult() {
  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumbs>
        <Link href="/classroom">Home</Link>
        <span>mockup classroom</span>
        <Link href="/assignment">Assignment</Link>
        <span>mockup assignment</span>
        <span>mockup_group_name</span>
        <span style={{ color: "var(--color-black)", fontWeight: 500 }}>Test Result</span>
      </Breadcrumbs>

      {/* Result Test Case Card */}
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
          <div className="flex items-center gap-3">
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Test Case</h4>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0}}>
          <iframe 
            src="/log.html" 
            title="Robot Framework Log"
            style={{ width: '100%', height: '500px', border: 'none', display: 'block' }} 
          />
        </AccordionDetails>
      </Accordion>

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