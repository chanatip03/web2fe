"use client";

import dayjs from "dayjs";
import Link from "next/link";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupsIcon from '@mui/icons-material/Groups';

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

      {/* Due Date */}
      <p className="mb-3">
        <span className="font-bold">Due Date :</span>{" "}
        <span className="text-red-500">
          {dayjs(assignment.dueDate).format("D MMMM YYYY [at] HH.mm")}
        </span>
      </p>

      <div className="grid grid-cols-12 gap-10">

        {/* LEFT SIDE */}
        <div className="col-span-8">

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

          <ul className="mb-7 space-y-1">
            <li className="hover:text-primary03 transition cursor-pointer"><InsertDriveFileIcon/> Assignment.pdf</li>
            <li className="hover:text-primary03 transition cursor-pointer"><InsertDriveFileIcon/> image1.png</li>
          </ul>
        </div>

        {/* RIGHT SIDE GROUP BOX */}
        {assignment.isGroup && (
        <div className="col-span-4">
            <div className="bg-white rounded-xl shadow border border-neutral03 overflow-hidden">
                <div className="bg-primary03 text-white px-6 py-3 font-semibold">
                    <GroupsIcon className="mr-1 inline-block" /> Group
                </div>

                <div className="p-8 flex justify-center">
                    <button className="bg-primary03 text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition">
                    + Create Group
                    </button>
                </div>
            </div>
        </div>
        )}

        {/* Submit file */}
        <div className="col-span-12 bg-white rounded-xl shadow border border-neutral03 mb-3">
            <div className="bg-neutral02 px-6 py-3 font-semibold text-neutral06 rounded-t-xl">
                Submit file
            </div>

            <div className="h-[280px] flex items-center justify-center text-neutral04">
                {assignment.isGroup
                ? "Please create group before submit assignment"
                : "Upload your assignment here"}
            </div>
        </div>

        {/* Deployment Results */}
        <div className="col-span-12 bg-white rounded-xl shadow border border-neutral03">
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
