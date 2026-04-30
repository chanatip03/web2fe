"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ScorebookTable from "./scorebookTable";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import {
  assignmentService,
  classroomMemberService,
  projectService,
} from "@/services/controller";

// ─── Shape that ScorebookTable expects ───────────────────────────────────────
interface StudentRow {
  id: number;
  studentId: string;
  user: { firstName: string; lastName: string };
  project: { assignmentId: number; score: number | null }[];
}

interface ScorebookData {
  assignments: { id: number; title: string }[];
  student: StudentRow[];
}

export default function TeacherScorebookPage() {
  const { id: classroomId } = useParams();

  const [data, setData] = useState<ScorebookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch & build scorebook data ────────────────────────────────────────
  useEffect(() => {
    if (!classroomId) return;
    const cid = Number(classroomId);

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch members + assignments in parallel
        const [members, assignments] = await Promise.all([
          classroomMemberService.getMembers(cid),
          assignmentService.getAssignments(cid),
        ]);

        // 2. Fetch projects for every assignment in parallel
        const projectsPerAssignment = await Promise.all(
          assignments.map(async (a: any) => {
            try {
              const projects = await projectService.getProjectsByAssignment(a.id);
              return { assignmentId: a.id, projects };
            } catch {
              return { assignmentId: a.id, projects: [] };
            }
          })
        );

        // 3. Build scoreMap: studentDbId -> { assignmentId -> score }
        //    - Group project:      project.students = all group members (Student objects, eagerly loaded)
        //    - Individual project: project.students = [single student], fallback to project.student_id
        const scoreMap: Record<number, Record<number, number | null>> = {};

        for (const { assignmentId, projects } of projectsPerAssignment) {
          for (const project of projects as any[]) {
            const studentsList: any[] = project.students ?? [];

            if (studentsList.length > 0) {
              // Map every member of this project (works for both group and individual)
              for (const s of studentsList) {
                const sid: number = s.id; // Student DB id
                if (!scoreMap[sid]) scoreMap[sid] = {};
                scoreMap[sid][assignmentId] = project.score ?? null;
              }
            } else if (project.student_id != null) {
              // Fallback: individual project where students[] failed to populate
              const sid: number = project.student_id;
              if (!scoreMap[sid]) scoreMap[sid] = {};
              scoreMap[sid][assignmentId] = project.score ?? null;
            }
          }
        }

        // 4. Map classroom members -> StudentRow (m.student.id = Student DB id = scoreMap key)
        const studentRows: StudentRow[] = members.map((m: any) => {
          const s = m.student;
          const sid: number = s?.id ?? m.id;
          return {
            id: sid,
            studentId: s?.student_id ?? s?.studentId ?? "-",
            user: {
              firstName: s?.user?.first_name ?? s?.user?.firstName ?? "",
              lastName: s?.user?.last_name ?? s?.user?.lastName ?? "",
            },
            project: assignments.map((a: any) => ({
              assignmentId: a.id,
              score: scoreMap[sid]?.[a.id] ?? null,
            })),
          };
        });

        setData({
          assignments: assignments.map((a: any) => ({ id: a.id, title: a.title })),
          student: studentRows,
        });
      } catch (err: any) {
        setError(err.message ?? "Failed to load scorebook");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [classroomId]);

  // ─── CSV Export ───────────────────────────────────────────────────────────
  const handleExportCsv = useCallback(() => {
    if (!data) return;

    const headers = [
      "Student ID",
      "First Name",
      "Last Name",
      ...data.assignments.map((a) => `"${a.title.replace(/"/g, '""')}"`),
      "Total",
    ];

    const rows = data.student.map((s) => {
      const scores = data.assignments.map((a) => {
        const p = s.project.find((p) => p.assignmentId === a.id);
        return p?.score != null ? String(p.score) : "0";
      });
      const total = s.project.reduce(
        (sum, p) => sum + (p.score ?? 0),
        0
      );
      return [
        s.studentId,
        s.user.firstName,
        s.user.lastName,
        ...scores,
        String(total),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scorebook-${Cookies.get("classroomName") ?? classroomId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data, classroomId]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex flex-col items-start justify-start gap-2 mb-6">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link href="/classroom">Home</Link>
          <span>{Cookies.get("classroomName")}</span>
          <span className="text-black">Scorebook</span>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between mb-8">
        <h1 className="-mb-2">Scorebook</h1>

        <Button
          id="export-csv-btn"
          variant="contained"
          startIcon={<FileUploadIcon />}
          onClick={handleExportCsv}
          disabled={!data || isLoading}
        >
          Export (.csv)
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
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

      {/* Table */}
      {!isLoading && !error && data && <ScorebookTable data={data} />}

      {/* Empty state */}
      {!isLoading && !error && data && data.student.length === 0 && (
        <Typography sx={{ mt: 2 }}>No students found in this classroom.</Typography>
      )}
    </div>
  );
}
