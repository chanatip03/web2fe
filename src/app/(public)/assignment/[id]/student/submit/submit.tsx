"use client";

import { useState } from "react";
import SubmitPanel from "./SubmitPanel";
import dayjs from "dayjs";
import Link from "next/link";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupsIcon from '@mui/icons-material/Groups';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateGroupModal from "./CreateGroupModal";
import GroupCard from "./GroupCard";
import { Group } from "./mockGroup";

/* ================= TYPES ================= */

export interface Assignment {
  id: number;
  name: string;
  detail: string;
  startDate: string;
  dueDate: string;
  isGroup: boolean;
  testcaseUrl: string;
  isPublic: boolean;
  projectTypeId: number;
  projecrLanguage: string;
  classroomId: number;
  createdDate: string;
  updatedDate: string;
  deletedDate: string | null;
}

interface Props {
  assignment: Assignment;
}

/* ================= COMPONENT ================= */

export default function SubmitPage({ assignment }: Props) {
    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState<Group | null>(null);
    const hasGroup = !!group; // TODO: เอาจาก API group student
    const canSubmit = !assignment.isGroup || hasGroup;
    
  return (
    <div className="max-w-[1500px] mx-auto px-10 py-8 bg-neutral01">

      {/* Breadcrumb */}
      <div className="text-sm mb-6">
        <Link
          href="/classroom/listclassroom"
          className="text-neutral04 hover:text-primary03 transition"
        >
          Home
        </Link>
        <span className="mx-2 text-neutral04">/</span>
        <span className="text-neutral04">claassroom name</span>
        <span className="mx-2 text-neutral04">/</span>
        <span className="text-neutral04">Assignment</span>
        <span className="mx-2 text-neutral04">/</span>
        <span className="font-semibold text-foreground">
          {assignment.name}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-bold mb-4 text-foreground">
        {assignment.name}
      </h1>

      <div className="grid grid-cols-12 gap-10">

        {/* LEFT SIDE */}
        <div className="col-span-8">
          {/* Due Date */}
          <p className="mb-3">
              <span className="font-bold">Due Date :</span>{" "}
              <span className="text-red-500">
              {dayjs(assignment.dueDate).format("D MMMM YYYY [at] HH.mm")}
              </span>
          </p>

          {/* Detail */}
          <h2 className="font-bold text-lg mb-0.5">
            Assignment Detail
          </h2>

          <p className="text-neutral06 whitespace-pre-line mb-8 leading-relaxed">
            {assignment.detail}
          </p>

          {/* Attachments */}
          <h2 className="font-bold text-lg mb-2">
            Attachments
          </h2>

          <ul className="mb-5 space-y-1">
            <li className="hover:text-primary03 transition cursor-pointer"><InsertDriveFileIcon/> Assignment.pdf</li>
            <li className="hover:text-primary03 transition cursor-pointer"><InsertDriveFileIcon/> image1.png</li>
          </ul>
        </div>

        {/* RIGHT SIDE GROUP BOX */}
        {assignment.isGroup && (
          <div className="col-span-4">
            {group ? (
              <GroupCard
                group={group}
                onEdit={() => setOpen(true)}
              />
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
        />

        {/* Submit file */}
        <div
        className={`col-span-12 rounded-xl shadow-xl border mb-3 overflow-hidden
            ${canSubmit
            ? "border-neutral03"
            : "border-neutral03 bg-white"}
        `}
        >
            {/* HEADER */}
            <div
                className={`px-6 py-3 font-semibold flex items-center justify-between
                ${canSubmit
                    ? "bg-primary03 text-white"
                    : "bg-neutral02 text-neutral06"}
                `}
            >
                
                <span className="font-semibold flex items-center gap-2"><UploadFileIcon />Submit file</span>
            </div>

            {/* BODY */}
            <div className="bg-white">
                <SubmitPanel
                isGroup={assignment.isGroup}
                hasGroup={hasGroup}
                />
            </div>
        </div>


        {/* Deployment Results */}
        <div className="col-span-12 bg-white rounded-xl shadow-xl border border-neutral03">
            <div className="bg-neutral02 px-6 py-3 font-semibold text-neutral06 rounded-t-xl">
                Deployment Results
            </div>

            <div className="h-[220px] flex items-center justify-center text-neutral04">
                The results will appear after you finish uploading the project.
            </div>
        </div>

      </div>
    </div>
  );
}
