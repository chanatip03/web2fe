"use client";

import { useEffect, useState } from "react";
import SubmitPanel from "../../../../../../components/SubmitPanel";
import DeploymentStatus, {
  SubmitStatus,
} from "../../../../../../components/DeploymentStatus";
import dayjs from "dayjs";
import Link from "next/link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateGroupModal from "../../../../../../components/modal/CreateGroupModal";
import GroupCard from "../../../../../../components/GroupCard";
import { Breadcrumbs } from "@mui/material";
import { Group } from "@/domain/group";
import { Assignment } from "@/domain/assignment";
import { assignmentService, groupService } from "@/services/controller";
import { useParams } from "next/navigation";

export default function StudentAssignmentInfoPage() {
  const [assignment, setAssignments] = useState<Assignment>();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const hasGroup = !!group;
  const [status, setStatus] = useState<SubmitStatus>("editing");
  const [deployResult, setDeployResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  
  const testcase = { 
    pass: deployResult?.testcase?.passed || 0, 
    fail: deployResult?.testcase?.failed || 0, 
    success: deployResult?.testcase?.status === "success" 
  };
  
  const security = { 
    success: deployResult?.cyber?.status === "success" 
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
        {/* <span>{classrooms?.name}</span> */}
        <span>Mock up data</span>
        <span className="text-black font-medium">Assigment</span>
        {/* <span>{assignment?.name}</span> */}
        <span>Mock up data</span>
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
            <span className="text-red-500">
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

          <ul className="mb-5 space-y-1">
            <li className="hover:text-primary03 transition cursor-pointer">
              <InsertDriveFileIcon /> Assignment.pdf
            </li>
            <li className="hover:text-primary03 transition cursor-pointer">
              <InsertDriveFileIcon /> image1.png
            </li>
          </ul>
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
          onSave={(g) => setGroup(g)}
          assignmentId={Number(assignMentId)}
          classroomId={Number(id)}
          initialGroup={group}
        />

        {/* Submit file */}
        <div
          className={`col-span-12 rounded-xl shadow-xl border mb-3 overflow-hidden
            ${!assignment.is_group && hasGroup ? "border-neutral03" : "border-neutral03 bg-white"}
        `}
        >
          {/* HEADER */}
          <div
            className={`px-6 py-3 font-semibold flex items-center justify-between
                ${
                  !assignment.is_group && hasGroup
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
                ${
                  status === "editing"
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
              <DeploymentStatus
                status={status}
                projectTypeId={assignment.project_type.id}
                deploySuccess={deploySuccess}
                testcase={testcase}
                security={security}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
