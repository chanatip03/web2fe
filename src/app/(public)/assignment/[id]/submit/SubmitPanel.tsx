"use client";

import { useRef, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
  isGroup: boolean;
  hasGroup?: boolean;
}

export default function SubmitPanel({ isGroup, hasGroup }: Props) {
  const [type, setType] = useState<"file" | "github">("github");
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isGroup && !hasGroup) {
    return (
      <div className="h-[260px] flex items-center justify-center text-neutral04">
        Please create group before submit assignment
      </div>
    );
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    console.log("Uploaded:", files[0]);
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="p-6 space-y-6">

        {/* SELECT TYPE */}
        <div>
          <p className="font-semibold mb-3">Select project source type</p>

          <label className="mr-8">
            <input
              type="radio"
              checked={type === "github"}
              onChange={() => setType("github")}
              className="mr-2 size-4"
            />
            Github Repository
          </label>

          <label>
            <input
              type="radio"
              checked={type === "file"}
              onChange={() => setType("file")}
              className="mr-2 size-4"
            />
            Project files
          </label>

        </div>

        {/* BOXES */}
        <div className="grid grid-cols-2 gap-6">

          {/* LEFT BOX */}
          <div
            onDragOver={
              type === "file"
                ? (e) => {
                    e.preventDefault();
                    setDrag(true);
                  }
                : undefined
            }
            onDragLeave={type === "file" ? () => setDrag(false) : undefined}
            onDrop={
              type === "file"
                ? (e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFiles(e.dataTransfer.files);
                  }
                : undefined
            }
            onClick={
              type === "file"
                ? () => fileInputRef.current?.click()
                : undefined
            }
            className={`border rounded-lg h-[200px] flex items-start justify-start cursor-pointer transition p-3
              ${
                type === "file"
                  ? drag
                    ? "border-primary03 bg-primary03/10"
                    : "border-neutral03"
                  : "border-neutral03 cursor-default"
              }
            `}
          >
            {type === "file" ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="border border-dashed px-5 py-2 rounded text-neutral05 flex items-center gap-2">
                  <UploadFileIcon fontSize="small" />
                  Upload File
                </div>
              </div>
            ) : (
              <textarea
                placeholder="Input Github repository Link"
                className="w-full h-full outline-none resize-none"
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* RIGHT BOX */}
          <textarea
            placeholder="Input environment variables"
            className="border rounded-lg h-[200px] p-3 outline-none resize-none border-neutral03"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-2">
          <button className="bg-primary03 text-white px-6 py-2 rounded-lg shadow-xl hover:opacity-90">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
