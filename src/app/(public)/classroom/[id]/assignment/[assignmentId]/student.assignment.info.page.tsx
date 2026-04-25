"use client";

import { useEffect, useState } from "react";
import SubmitPanel from "../../../../../../components/SubmitPanel";
import DeploymentStatus, {
  SubmitStatus,
} from "../../../../../../components/DeploymentStatus";
import CyberScanResultModal from "../../../../../../components/modal/CyberScanResultModal";
import dayjs from "dayjs";
import Link from "next/link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateGroupModal from "../../../../../../components/modal/CreateGroupModal";
import GroupCard from "../../../../../../components/GroupCard";
import { Breadcrumbs } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { Group } from "@/domain/group";
import { Assignment } from "@/domain/assignment";
import { assignmentService, groupService, projectService, userService } from "@/services/controller";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function StudentAssignmentInfoPage() {
  const [assignment, setAssignments] = useState<Assignment>();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const hasGroup = !!group;
  const [status, setStatus] = useState<SubmitStatus>("editing");
  const [deployResult, setDeployResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cyberModalOpen, setCyberModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const params = useParams();
  const id = params.id;
  const assignMentId = params.assignmentId;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await assignmentService.getAssignmentById(
          Number(assignMentId),
        );
        setAssignments(data);

        try {
          const groupData = await groupService.getMyGroup(Number(assignMentId));
          setGroup(groupData as any);
        } catch (groupErr) {
          console.error("Failed to fetch group", groupErr);
        }

        // Fetch existing project results
        try {
          const [projects, currentUser] = await Promise.all([
            projectService.getProjectsByAssignment(Number(assignMentId)),
            userService.getCurrentUser(),
          ]);

          const myStudentId = currentUser.id;
          // Find the LATEST project where current student is a member
          const studentProjects = projects.filter((p: any) =>
            p.students?.some((s: any) => s.id === myStudentId)
          );

          const userProject = studentProjects.sort((a: any, b: any) => b.id - a.id)[0];

          if (userProject) {
            console.log("Loading latest user project:", userProject);
            const tc = userProject.testcase_result ? JSON.parse(userProject.testcase_result) : null;
            const cyber = userProject.cybersecurity_result ? JSON.parse(userProject.cybersecurity_result) : null;

            setDeployResult({
              testcase: tc,
              cyber: cyber,
              deployment: { status: "success" },
              submission_id: userProject.id.toString(), // Use numeric project ID for cleaner URLs
              execution_mode: userProject.env,
              submission_uuid: userProject.submission_uuid, // Keep UUID for internal reference if needed
            });
            setStatus("done");
          }
        } catch (projErr) {
          console.error("Failed to fetch existing project results", projErr);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, assignMentId]);

  // Parse actual deploy results
  const deploySuccess = deployResult?.deployment?.status === "success";
  const displayId = deployResult?.project_db_id?.toString() || deployResult?.submission_id;
  
  // Use the backend redirect API so we don't have to rebuild, but without hardcoding proxy logic in frontend
  const previewUrl = displayId ? `${process.env.NEXT_PUBLIC_API_URL}/project/${displayId}/preview/redirect` : null;
  const swaggerUrl = displayId ? `/preview/${displayId}?type=backend&role=student` : null;

  const testcase = {
    pass: deployResult?.testcase?.passed ?? 0,
    fail: deployResult?.testcase?.failed ?? 0,
    success: !!deployResult?.testcase && (
      ["success", "fail"].includes(deployResult?.testcase?.status) ||
      typeof deployResult?.testcase?.passed === 'number'
    )
  };

  const security = {
    success: !!deployResult?.cyber && deployResult?.cyber?.status !== "error"
  };

  const hasFail =
    status === "done" &&
    (!deploySuccess ||
      ((assignment?.project_type?.id === 1 ||
        assignment?.project_type?.id === 2) &&
        (!testcase.success || !security.success)));

  if (loading || !assignment) return <div>Loading...</div>;

  return (
    <div className="max-w-[1500px] mx-auto px-10 py-8 bg-neutral01">
      {/* Breadcrumb */}
      <Breadcrumbs className="text-sm mb-6">
        <Link href="/classroom">Home</Link>
        <span>{Cookies.get("classroomName")}</span>
        <Link href={`/classroom/${id}/assignment`}>Assignment</Link>
        <span className="text-black font-medium">{assignment.title}</span>
      </Breadcrumbs>

      {/* Title */}
      <h1 className="font-bold mb-4 text-foreground mt-5">
        {assignment.title}
      </h1>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT SIDE */}
        <div className="col-span-8">
          {/* Due Date */}
          <p className="mb-3">
            <span className="font-bold">Due Date :</span>{" "}
            <span className={new Date(assignment.due_date).getTime() < Date.now() ? "text-red-500" : "text-black"}>
              {dayjs(assignment.due_date).format("D MMMM YYYY [at] HH.mm")}
            </span>
          </p>

          {/* Detail */}
          <h2 className="font-bold text-lg mb-0.5">Assignment Detail</h2>

          <p className="text-neutral06 whitespace-pre-line mb-8 leading-relaxed">
            {assignment.description}
          </p>

          {/* Attachments */}
          <h2 className="font-bold text-lg mb-2">Attachments</h2>

          {assignment.attachments && assignment.attachments.length > 0 ? (
            <ul className="mb-5 space-y-1">
              {assignment.attachments.map((attachment) => (
                <li key={attachment.id} className="hover:text-primary03 transition cursor-pointer">
                  <a
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <InsertDriveFileIcon />
                    {attachment.file_url.split('/').pop() || 'Attachment'}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral06 mb-5">No attachments available</p>
          )}

        </div>

        {/* RIGHT SIDE GROUP BOX */}
        {assignment.is_group && (
          <div className="col-span-4">
            {group ? (
              <GroupCard group={group} onEdit={() => setOpen(true)} />
            ) : (
              <div className="bg-white rounded-xl shadow-xl border border-neutral03 overflow-hidden">
                <div className="bg-primary03 text-white px-6 py-3 font-semibold">
                  <GroupsIcon className="mr-1 inline-block" /> Group
                </div>

                <div className="p-8 flex justify-center">
                  <button
                    onClick={() => setOpen(true)}
                    className="bg-primary03 text-white px-6 py-3 rounded shadow-xl hover:opacity-90 transition flex items-center gap-2"
                  >
                    + Create Group
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <CreateGroupModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={(g) => {
            setGroup(g);
            setSnackbar({ open: true, message: 'Group saved successfully!', severity: 'success' });
          }}
          assignmentId={Number(assignMentId)}
          classroomId={Number(id)}
          initialGroup={group}
        />

        {/* Submit file */}
        <div
          className={`col-span-12 rounded-xl shadow-xl border mb-3 overflow-hidden
            ${!assignment.is_group || hasGroup
              ? "border-primary03 bg-white"
              : "border-neutral03 bg-white"
            }
        `}
        >
          {/* HEADER */}
          <div
            className={`px-6 py-3 font-semibold flex items-center justify-between
                ${!assignment.is_group || hasGroup
                ? "bg-primary03 text-white"
                : "bg-neutral02 text-neutral06"
              }
                `}
          >
            <span className="font-semibold flex items-center gap-2">
              <UploadFileIcon />
              Submit file
            </span>
          </div>

          {/* BODY */}
          <div className="bg-white">
            <SubmitPanel
              isGroup={assignment.is_group}
              hasGroup={hasGroup}
              assignmentId={Number(assignMentId)}
              projectTypeId={assignment.project_type?.id}
              groupId={group?.id}
              status={status}
              setStatus={setStatus}
              onPipelineSuccess={setDeployResult}
              onPipelineError={setDeployResult}
            />
          </div>
        </div>

        {/* Deployment Results */}
        <div className="col-span-12 bg-white rounded-xl shadow-xl border border-neutral03">
          <div
            className={`px-6 py-3 font-semibold rounded-t-xl
                ${status === "editing"
                ? "bg-neutral02 text-neutral06"
                : hasFail
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }
              `}
          >
            Deployment Results
          </div>

          <div className="p-6">
            {status === "editing" ? (
              <div className="h-[220px] flex items-center justify-center text-neutral04">
                The results will appear after you finish uploading the project.
              </div>
            ) : (
              <>
                <DeploymentStatus
                  status={status}
                  projectTypeId={assignment.project_type.id}
                  deploySuccess={deploySuccess}
                  testcase={testcase}
                  security={security}
                  onViewSecurity={() => setCyberModalOpen(true)}
                />

                <CyberScanResultModal
                  open={cyberModalOpen}
                  onClose={() => setCyberModalOpen(false)}
                  data={deployResult?.cyber ? {
                    ...deployResult.cyber,
                    download_url: deployResult.cyber.download_url?.startsWith('http')
                      ? deployResult.cyber.download_url
                      : `${process.env.NEXT_PUBLIC_API_URL}${deployResult.cyber.download_url?.startsWith('/api')
                        ? deployResult.cyber.download_url.substring(4)
                        : deployResult.cyber.download_url}`
                  } : null}
                />

                {/* Preview link — only shown when deploy succeeded */}
                {status === "done" && deploySuccess && (
                  <div className="mt-5 pt-5 border-t border-neutral03 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Deployed Application</p>
                      <p className="text-xs text-neutral05 mt-0.5">
                        Container runs for 2 hours then auto-removes.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {/* Detection logic for backend-only projects */}
                      {(deployResult.deployment?.deploy_mode === "backend-only" ||
                        deployResult.execution_mode === "backend-only" ||
                        assignment.project_type?.id === 2) ? (
                        <>
                          <a
                            href={swaggerUrl || `/preview/${deployResult.submission_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-all text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-200/50 active:scale-95"
                          >
                            <span className="text-lg"></span> View API Docs (Swagger) ↗
                          </a>
                        </>
                      ) : (
                        <a
                          href={previewUrl || `${process.env.NEXT_PUBLIC_API_URL}/project/${deployResult.submission_id}/preview/redirect`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-all text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-200/50 active:scale-95"
                        >
                          <span className="text-lg"></span> Open Live Preview ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
