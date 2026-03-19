"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs, Accordion, AccordionSummary, AccordionDetails, OutlinedInput, InputAdornment, Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

export default function TestResult_fe_be() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for backend data
  const [cyberScanData, setCyberScanData] = useState<any>(null);
  const [plagiarismData, setPlagiarismData] = useState<any>(null);
  const [logHtmlUrl, setLogHtmlUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock fetching data from backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        // FIXME: Replace this setTimeout with your actual backend API call 
        // const response = await fetch('/api/test-results');
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

        setPlagiarismData({
          status: "success",
          total_comparisons: 6,
          data: [
            { student1: "G1.js", student2: "Group3.js", avg_similarity: 74.07 },
            { student1: "G1.js", student2: "test.js", avg_similarity: 50.31 },
            { student1: "Group3.js", student2: "G1.js", avg_similarity: 74.07 },
            { student1: "Group3.js", student2: "test.js", avg_similarity: 80 },
            { student1: "test.js", student2: "G1.js", avg_similarity: 50.31 },
            { student1: "test.js", student2: "Group3.js", avg_similarity: 80 },
          ],
        });

        // Simulating HTML URL (or raw string if backend sends `srcDoc={rawString}`)
        // If backend sends a URL, leave as is. If it sends raw HTML string, use `srcDoc` in the iframe below instead of `src`
        setLogHtmlUrl("/log.html");

      } catch (error) {
        console.error("Error fetching test results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading || !plagiarismData || !cyberScanData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
        <CircularProgress sx={{ color: 'var(--color-primary03)' }} />
        <Typography style={{ color: "var(--color-neutral05)" }}>Loading test results...</Typography>
      </Box>
    );
  }

  const currentProjectFile = "G1.js";
  const studentMap: Record<string, { id: string; name: string }> = {
    "Group3.js": { id: "66090500402", name: "นายปุ๊ ระเบิดขวด" },
    "test.js": { id: "66090500403", name: "นายแดง ใบเล่" },
  };

  const projectComparisons = Array.from(
    new Map(
      plagiarismData.data
        .filter((item: any) => item.student1 === currentProjectFile || item.student2 === currentProjectFile)
        .map((item: any) => {
          const otherFile = item.student1 === currentProjectFile ? item.student2 : item.student1;
          const studentInfo = studentMap[otherFile] || { id: "Unknown", name: otherFile };
          return [
            studentInfo.id,
            {
              id: studentInfo.id,
              name: studentInfo.name,
              score: item.avg_similarity,
            }
          ];
        })
    ).values()
  ) as any[];

  const filteredPlagiarism = projectComparisons.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueComparisonsMap = new Map();
  plagiarismData.data.forEach((item: any) => {
    // Sort filenames alphabetically to create a unique key for any A<->B comparison pair
    const key = [item.student1, item.student2].sort().join("-");
    if (!uniqueComparisonsMap.has(key)) {
      uniqueComparisonsMap.set(key, item);
    }
  });
  
  const uniqueComparisons = Array.from(uniqueComparisonsMap.values()) as any[];

  const averageSimilarity = uniqueComparisons.length > 0
    ? uniqueComparisons.reduce((acc: any, curr: any) => acc + curr.avg_similarity, 0) / uniqueComparisons.length
    : 0;
  
  let avgColorClass = "bg-[var(--color-success01)]";
  if (averageSimilarity >= 80) avgColorClass = "bg-[#da291c]"; // Red warning
  else if (averageSimilarity >= 60) avgColorClass = "bg-[#ffb300]"; // Yellow/Orange warning

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
            src={logHtmlUrl} 
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

      {/* Plagiarism Test Result Card */}
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
            py: 1,
            '.MuiAccordionSummary-content': {
               justifyContent: 'space-between',
               alignItems: 'center',
            }
          }}
        >
          <div className="flex items-center gap-4">
            <h4 style={{ color: "var(--color-black)", margin: 0 }}>Result Plagiarism Test</h4>
            <div className={`flex items-center gap-2 ${avgColorClass} text-white px-3 py-1 rounded-[4px]`}>
              <span className="text-[13px] font-medium opacity-90">Average Similar Score</span>
              <span className="font-bold text-[15px]">{averageSimilarity.toFixed(2)}%</span>
            </div>
          </div>
          <div className="mx-8" onClick={(e) => e.stopPropagation()}>
            <OutlinedInput
              size="small"
              placeholder="Search Student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--color-neutral04)' }} />
                </InputAdornment>
              }
              sx={{ 
                width: 200, 
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-neutral03)',
                }
              }}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[var(--color-neutral03)]">
                <th className="py-3 px-6 font-bold text-[15px] w-1/3" style={{ color: "var(--color-black)" }}>Student ID</th>
                <th className="py-3 px-6 font-bold text-[15px] w-1/3" style={{ color: "var(--color-black)" }}>Student name</th>
                <th className="py-3 px-6 font-bold text-[15px] w-1/3 text-right" style={{ color: "var(--color-black)" }}>Similar Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlagiarism.map((item, index) => {
                const isEven = index % 2 === 0;
                let colorClass = "bg-[var(--color-success01)]";
                if (item.score >= 80) colorClass = "bg-[#da291c]"; // Red warning
                else if (item.score >= 60) colorClass = "bg-[#ffb300]"; // Yellow/Orange warning
                return (
                  <tr key={index} className={`border-b border-[var(--color-neutral03)] ${isEven ? 'bg-white' : 'bg-[#eef6ff]'}`}>
                    <td className="py-3 px-6 text-[15px]" style={{ color: "var(--color-black)" }}>{item.id}</td>
                    <td className="py-3 px-6 text-[15px]" style={{ color: "var(--color-black)" }}>{item.name}</td>
                    <td className="py-3 px-6 flex justify-end">
                      <div className={`${colorClass} text-white font-bold px-3 py-1 rounded w-16 text-center text-[14px]`}>
                        {Number(item.score).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>

    </div>
  );
}