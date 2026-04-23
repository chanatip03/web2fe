"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  Typography,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { assignmentService } from "@/services/controller";
import { projectService } from "@/services/controller";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { Assignment } from "@/domain/assignment";
import { Project } from "@/domain/project";
import TestCaseFormModal from "@/components/modal/testCaseFormModal";

export default function TeacherAssignmentInfoPage() {
  const [assignments, setAssignments] = useState<Assignment>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentLoadFailed, setAssignmentLoadFailed] = useState(false);
  const [tab, setTab] = useState<"inprogress" | "complete">("inprogress");
  const [openTestcase, setOpenTestcase] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const params = useParams();
  const id = params.id;
  const assignMentId = params.assignmentId;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setAssignmentLoadFailed(false);

      try {
        const assignmentData = await assignmentService.getAssignmentById(Number(assignMentId));
        setAssignments(assignmentData);

        try {
          const projectData = await projectService.getProjectsByAssignment(Number(assignMentId));
          setProjects(projectData);
        } catch (err) {
          console.error(err);
          setProjects([]);
          setSnackbar({
            open: true,
            message: "Unable to load submitted projects right now.",
            severity: "error",
          });
        }
      } catch (err) {
        console.error(err);
        setAssignmentLoadFailed(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [assignMentId]);

  // In-progress: score AND feedback are both null/undefined
  // Complete: score OR feedback has a value
  const filteredProjects = projects.filter((project) => {
    const isComplete = project.score != null || project.feedback != null;
    return tab === "complete" ? isComplete : !isComplete;
  });

  const isLate = (project: Project) => {
    if (!assignments?.due_date || !project.created_date) return false;
    return new Date(project.created_date) > new Date(assignments.due_date);
  };

  const getDisplayName = (project: Project) => {
    if (project.group_name) return project.group_name;
    if (project.students && project.students.length > 0) {
      return project.students
        .map((s) => `${s.user.first_name} ${s.user.last_name}`)
        .join(", ");
    }
    return `Project #${project.id}`;
  };

  if (loading) return <div>Loading...</div>;
  if (!assignments) return <div>{assignmentLoadFailed ? "Failed to load assignment." : "Loading..."}</div>;

  const hasTestcase = !!assignments.testcase_url;

  return (
    <>
    <div>
      <div className="mb-6">
        <Breadcrumbs separator="/">
          <Link href="/classroom">Home</Link>
          <span>{Cookies.get("classroomName")}</span>
          <Link href={`/classroom/${id}/assignment`}>Assignment</Link>
          <span className="text-black font-medium">{assignments.title}</span>
        </Breadcrumbs>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h1>{assignments.title}</h1>
        {assignments.project_type?.id !== 3 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTestcase(true)}
          >
            {hasTestcase ? "Edit TestCase" : "Create TestCase"}
          </Button>
        )}
      </div>
      <TestCaseFormModal
        open={openTestcase}
        onClose={() => setOpenTestcase(false)}
        testcase={assignments.testcase_url}
        assignmentId={assignMentId as string}
        assignmentTitle={assignments.title}
        assignmentDescription={assignments.description ?? ""}
        onSaveSuccess={() => window.location.reload()}
         onSuccess={(message) => {
            setSnackbar({
              open: true,
              message,
              severity: "success",
            });
          }}
          onError={(message) => {
            setSnackbar({
              open: true,
              message,
              severity: "error",
            });
          }}
      />

      <div className="flex gap-2 mb-2">
        <h5>Due Date</h5>

        <p className={`p2 ${new Date(assignments.due_date).getTime() < Date.now() ? "text-accent03 font-semibold" : "text-black"}`}>
          {new Date(assignments.due_date).toLocaleString("en-GB", {
            timeZone: "Asia/Bangkok",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="mb-6">
        <h5 className="mb-2">Assignment Detail</h5>

        <div>
          <p className="p2">{assignments.description}</p>
        </div>
      </div>

      <Paper sx={{ backgroundColor: "#ffffff" }}>
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          variant="fullWidth"
          sx={{
            borderRadius: "8px 8px 0 0",
            borderBottom: "1px solid #C7C7C7",
            height: "62px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            label="Inprogress"
            value="inprogress"
            sx={{
              textTransform: "none",
              borderRadius: "8px 0 0 0",
              height: "62px",
              fontSize: "18px",
              fontWeight: "bold",

              "&.Mui-selected": {
                backgroundColor: "#0D47A1",
                color: "#ffffff",
              },
            }}
          />

          <Tab
            label="Complete"
            value="complete"
            sx={{
              textTransform: "none",
              borderRadius: "0 8px 0 0",
              height: "62px",
              fontSize: "18px",
              fontWeight: "bold",

              "&.Mui-selected": {
                backgroundColor: "#0D47A1",
                color: "#ffffff",
              },
            }}
          />
        </Tabs>

        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#ffffff",
              }}
            >
              <TableCell align="center" sx={{ width: "25%" }}>
                Group name
              </TableCell>

              <TableCell align="center" sx={{ width: "20%" }}>
                Send date
              </TableCell>

              <TableCell align="center" sx={{ width: "15%" }}>
                Status
              </TableCell>

              <TableCell align="center" sx={{ width: "25%" }}>
                Members
              </TableCell>

              <TableCell sx={{ width: "15%" }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                  <Typography color="text.secondary" fontWeight={600}>
                    No student submitted
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  sx={{
                    "& td:first-of-type": {
                      px: 6,
                    },
                  }}
                >
                  <TableCell>
                    <h5>{getDisplayName(project)}</h5>
                  </TableCell>

                  <TableCell align="center">
                    {project.created_date
                      ? new Date(project.created_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell align="center">
                    <div
                      className={`inline-block px-4 py-2 w-[78px] rounded-md text-white
                       ${isLate(project) ? "bg-[#FFC107]" : "bg-[#3CB40B]"}
                     `}
                    >
                      <h6>{isLate(project) ? "Late" : "Ontime"}</h6>
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    {project.students && project.students.length > 0
                      ? project.students.map((s) => (
                          <Chip
                            key={s.id}
                            label={`${s.user.first_name} ${s.user.last_name}`}
                            size="small"
                            sx={{ mr: 1, mb: 0.5 }}
                          />
                        ))
                      : <Typography variant="body2" color="text.secondary">—</Typography>
                    }
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 6 }}>
                    <Link href={`/preview/${project.id}`}>
                      <Button variant="contained" size="small" sx={{ px: 4 }}>
                        Preview
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
     <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="standard"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}