"use client";

import { useRef, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import JSZip from "jszip";

interface Props {
  isGroup: boolean;
  hasGroup?: boolean;
}

export default function SubmitPanel({ isGroup, hasGroup }: Props) {
  const [type, setType] = useState<"file" | "github">("github");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const canUpload = uploadedFiles.length === 0;
  const [envText, setEnvText] = useState("");
  const rootFolders = Array.from(
    new Set(
      uploadedFiles.map(f => {
        const path = (f as any).webkitRelativePath;
        return path ? path.split("/")[0] : "uploaded-files";
      })
    )
  );
  
  // ===== FILE FILTER =====
  const blacklist = [
    // JS
    "node_modules", ".next", ".nuxt", "dist", "build", "out", "coverage",
    ".cache", ".parcel-cache", ".turbo", ".vercel",
    // Java
    "target", ".gradle", "build",
    // Python
    "venv", "__pycache__", ".mypy_cache", ".pytest_cache",
    // PHP
    "vendor", "storage/logs", "bootstrap/cache",
    // Go/Rust
    "pkg", "bin",
    // IDE
    ".git", ".vscode", ".idea",
    // OS
    ".DS_Store", "Thumbs.db",
  ];

  const forbiddenExtensions = [
    ".env", ".pem", ".key", ".log",
  ];

  function shouldSkip(path: string) {
    const lower = path.toLowerCase();

    // skip dependency folders ONLY if file is inside them
    if (blacklist.some(folder => lower.includes(`/${folder}/`)))
      return true;

    // skip extension
    if (forbiddenExtensions.some(ext => lower.endsWith(ext)))
      return true;

    return false;
  }

  const removeFolder = (folderName: string) => {
    setUploadedFiles(prev =>
      prev.filter(file => {
        const path = (file as any).webkitRelativePath || file.name;
        return !path.startsWith(folderName + "/");
      })
    );
  };

  function filterFiles(files: FileList) {
    const kept: File[] = [];

    for (const file of Array.from(files)) {
      const path =
        (file as any).webkitRelativePath || file.name;

      if (!shouldSkip(path)) {
        kept.push(file);
      } else {
        console.log("Skipped:", path);
      }
    }

    return kept;
  }

  if (isGroup && !hasGroup) {
    return (
      <div className="h-[260px] flex items-center justify-center text-neutral04">
        Please create group before submit assignment
      </div>
    );
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const arr = Array.from(files);

    if (!arr[0]?.webkitRelativePath) {
      alert("❌ Please upload a FOLDER only");
      return;
    }

    const filtered = filterFiles(files);
    setUploadedFiles(prev => [...prev, ...filtered]);

    console.log("Uploaded filtered files:", filtered);

    for (const f of Array.from(files)) {
      console.log("PATH:", (f as any).webkitRelativePath);
    }

    // TODO: ส่ง filtered ไป backend
  };

  const removeFile = (index: number) => {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    async function zipFiles(files: File[]) {
    const zip = new JSZip();

    for (const file of files) {
      const path =
        (file as any).webkitRelativePath || file.name;

      zip.file(path, file);
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return blob;
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      console.log("No files uploaded");
      return;
    }
    const zipBlob = await zipFiles(uploadedFiles);
    await debugZipPaths(zipBlob);
    const form = new FormData();

    //แก้ไข key "file" ตาม API จริง และ ชื่อไฟล์ "submission.zip" ตามทีที่จะเก็บใน backend
    form.append("file", zipBlob, "submission.zip");

      // ส่ง env แยก
    if (envText.trim() !== "") {
      form.append("env", envText);
    }

    console.log("Submitting files:", uploadedFiles);
    console.log("Env text:", envText);
    //แก้ไข URL ตาม API จริง
    await fetch("/api/submit", {
      method: "POST",
      body: form,
    });

    console.log("Submission complete: ", zipBlob);
  };

  async function debugZipPaths(zipBlob: Blob) {
    const zip = await JSZip.loadAsync(zipBlob);

    console.log("====== ZIP PATHS ======");

    Object.keys(zip.files).forEach(path => {
      console.log(path);
    });

    console.log("====== END ======");
  }

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
            onClick={
              type === "file" && canUpload
                ? () => fileInputRef.current?.click()
                : undefined
            }
            className={`border border-neutral03 rounded-lg h-[200px] flex items-start justify-start cursor-pointer transition p-3`}
          >
            {type === "file" ? (
              uploadedFiles.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="border border-dashed px-5 py-2 rounded text-neutral05 flex items-center gap-2">
                    <UploadFileIcon fontSize="small" />
                    Upload File
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col gap-2 overflow-auto cursor-default">

                  {rootFolders.map((root) => (
                    <div
                      key={root}
                      className="flex items-center justify-between bg-neutral01 rounded px-3 py-2 border border-neutral04"
                    >
                      <div className="flex items-center gap-2 ">
                        <FolderOpenOutlinedIcon fontSize="medium" />
                        {root}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFolder(root);
                        }}
                        className="text-accent03 hover:opacity-80 cursor-pointer"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-primary03 text-left px-1 py-1 hover:underline cursor-pointer"
                  >
                    + Add more files
                  </button>

                </div>

              )
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
              multiple
              {...({ webkitdirectory: "true" } as any)}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* RIGHT BOX */}
          <textarea
            placeholder="Input environment variables"
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            className="border rounded-lg h-[200px] p-3 outline-none resize-none border-neutral03"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-2">
          <button type="button" onClick={handleSubmit} className="bg-primary03 text-white px-6 py-2 rounded-lg shadow-xl hover:opacity-90">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
