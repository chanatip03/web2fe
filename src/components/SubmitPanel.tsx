"use client";

import { useRef, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import JSZip from "jszip";

interface Props {
  isGroup: boolean;
  hasGroup?: boolean;
  assignmentId: number;
  projectTypeId?: number;
  groupId?: number;
  status: "editing" | "submitting" | "deploying" | "done";
  setStatus: (s: Props["status"]) => void;
  onPipelineSuccess?: (data: any) => void;
  onPipelineError?: (data: any) => void;
}

export default function SubmitPanel({
  isGroup,
  hasGroup,
  assignmentId,
  projectTypeId,
  groupId,
  status,
  setStatus,
  onPipelineSuccess,
  onPipelineError,
}: Readonly<Props>) {
  const [type, setType] = useState<"file" | "github">("github");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const canUpload = uploadedFiles.length === 0;
  const [envText, setEnvText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const isLocked = status !== "editing";
  const rootFolders = Array.from(
    new Set(
      uploadedFiles.map((f) => {
        const path = (f as any).webkitRelativePath;
        return path ? path.split("/")[0] : "uploaded-files";
      }),
    ),
  );

  // ===== FILE FILTER =====
  const blacklist = [
    // JS
    "node_modules",
    ".next",
    ".nuxt",
    "dist",
    "build",
    "out",
    "coverage",
    ".cache",
    ".parcel-cache",
    ".turbo",
    ".vercel",
    // Java
    "target",
    ".gradle",
    "build",
    // Python
    "venv",
    "__pycache__",
    ".mypy_cache",
    ".pytest_cache",
    // PHP
    "vendor",
    "storage/logs",
    "bootstrap/cache",
    // Go/Rust
    "pkg",
    "bin",
    // IDE
    ".git",
    ".vscode",
    ".idea",
    // OS
    ".DS_Store",
    "Thumbs.db",
  ];

  const forbiddenExtensions = [".env", ".pem", ".key", ".log"];

  function shouldSkip(path: string) {
    const lower = path.toLowerCase();

    // skip dependency folders ONLY if file is inside them
    if (blacklist.some((folder) => lower.includes(`/${folder}/`))) return true;

    // skip extension
    if (forbiddenExtensions.some((ext) => lower.endsWith(ext))) return true;

    return false;
  }

  const removeFolder = (folderName: string) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => {
        const path = (file as any).webkitRelativePath || file.name;
        return !path.startsWith(folderName + "/");
      }),
    );
  };

  function filterFiles(files: FileList) {
    const kept: File[] = [];

    for (const file of Array.from(files)) {
      const path = file.webkitRelativePath || file.name;

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
    setUploadedFiles((prev) => [...prev, ...filtered]);

    console.log("Uploaded filtered files:", filtered);

    for (const f of Array.from(files)) {
      console.log("PATH:", (f as any).webkitRelativePath);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isSubmissionReady =
    (type === "file" && uploadedFiles.length > 0) ||
    (type === "github" && githubUrl.trim() !== "");

  async function zipFiles(files: File[]) {
    const zip = new JSZip();

    for (const file of files) {
      const path = (file as any).webkitRelativePath || file.name;

      zip.file(path, file);
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return blob;
  }

  // Strip all whitespace / newlines the user may have copy-pasted with the URL
  const sanitizeUrl = (raw: string) =>
    raw
      .split(/\s+/)           // split on any whitespace (spaces, \n, \r, tabs)
      .filter(Boolean)        // drop empty parts
      .join("")               // rejoin (URL should not have internal spaces)
      .trim();

  const toDeployMode = (typeId?: number) => {
    if (typeId === 1) return "frontend-only";
    if (typeId === 2) return "backend-only";
    return "fullstack";
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (type === "file" && uploadedFiles.length === 0) {
      console.log("No files uploaded");
      return;
    }
    if (type === "github" && githubUrl.trim() === "") {
      console.log("No github url");
      return;
    }

    setStatus("submitting");

    const form = new FormData();

    if (type === "file") {
      const zipBlob = await zipFiles(uploadedFiles);
      await debugZipPaths(zipBlob);
      form.append("file", zipBlob, "submission.zip");
    } else {
      const cleanUrl = sanitizeUrl(githubUrl);

      // Basic GitHub URL validation before hitting the server
      if (!cleanUrl.startsWith("https://") && !cleanUrl.startsWith("http://")) {
        alert(`❌ Invalid repository URL.\nPlease paste a valid GitHub URL (e.g. https://github.com/user/repo.git)`);
        setStatus("editing");
        return;
      }

      form.append("repo_url", cleanUrl);
    }

    if (envText.trim() !== "") {
      form.append("env", envText);
    }
    if (groupId) {
      form.append("group_id", groupId.toString());
    }
    // Tell backend what kind of project this submission is.
    // The backend normalizes these values and will prefer this over LLM auto-detect.
    form.append("projectType", toDeployMode(projectTypeId));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submission/${assignmentId}`,
        {
          method: "POST",
          body: form,
          credentials: "include",
        },
      );
      if (!res.ok) {
        const t = await res.text();
        console.error("Submission HTTP Error:", t);
        throw new Error(`Failed to submit: ${t}`);
      }
      const data = await res.json();
      const submissionId = data.submission_id;

      let currentStatus = "submitting";
      const POLL_TIMEOUT_MS = 10 * 60 * 1000; // 10 min safety cap
      const pollStarted = Date.now();

      const poll = setInterval(async () => {
        // Safety timeout — stop polling even if backend never gives a terminal state
        if (Date.now() - pollStarted > POLL_TIMEOUT_MS) {
          clearInterval(poll);
          setStatus("done");
          if (onPipelineError)
            onPipelineError({ message: "Polling timed out after 10 minutes." });
          return;
        }

        const sRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submission/${submissionId}`,
          {
            credentials: "include",
          },
        );
        if (!sRes.ok) {
          clearInterval(poll);
          setStatus("done");
          if (onPipelineError) onPipelineError({ message: "Server error during polling." });
          return;
        }
        const sData = await sRes.json();

        // Check when deployment step finishes (for debugging)
        if (
          sData.steps?.deployment?.status === "success" ||
          sData.steps?.deployment?.status === "error"
        ) {
          console.log("Deployment finished:", sData.steps?.deployment?.status);
        }

        if (sData.pipeline_status === "running") {
          // Show "deploying" once any main step has started or deployment is done
          // (covers the r2_upload phase where deployment=success but pipeline still running)
          const deploymentActive =
            sData.steps?.deployment?.status === "running" ||
            sData.steps?.deployment?.status === "success" ||
            sData.steps?.deployment?.status === "error";

          if (deploymentActive && currentStatus !== "deploying") {
            currentStatus = "deploying";
            setStatus("deploying");
          }
        } else if (
          sData.pipeline_status === "success" ||
          sData.pipeline_status === "partial_success"
        ) {
          clearInterval(poll);
          if (onPipelineSuccess) onPipelineSuccess(sData);
          setStatus("done");
        } else if (sData.pipeline_status === "error") {
          clearInterval(poll);
          if (onPipelineError) onPipelineError(sData);
          setStatus("done");
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus("done");
    }
  };

  async function debugZipPaths(zipBlob: Blob) {
    const zip = await JSZip.loadAsync(zipBlob);

    console.log("====== ZIP PATHS ======");

    Object.keys(zip.files).forEach((path) => {
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
              onChange={() => {
                if (uploadedFiles.length > 0) {
                  // Clear uploaded files first
                  setUploadedFiles([]);
                }
                setType("github");
              }}
              disabled={uploadedFiles.length > 0 && type === "file"}
              className="mr-2 size-4"
            />
            Github Repository
          </label>

          <label>
            <input
              type="radio"
              checked={type === "file"}
              onChange={() => {
                if (githubUrl.trim() !== "") {
                  // Clear GitHub URL first
                  setGithubUrl("");
                }
                setType("file");
              }}
              disabled={githubUrl.trim() !== "" && type === "github"}
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
              type === "file" && canUpload && !isLocked
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
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={isLocked}
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
            placeholder="Input environment variables (if any)"
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            className="border rounded-lg h-[200px] p-3 outline-none resize-none border-neutral03"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-2">
          {status === "editing" && (
            <button
              onClick={handleSubmit}
              disabled={!isSubmissionReady}
              className={`text-white px-6 py-2 rounded-lg shadow-2xl ${
                isSubmissionReady
                  ? "bg-primary03 hover:opacity-90 cursor-pointer"
                  : "bg-neutral04 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          )}

          {status === "submitting" && (
            <button
              disabled
              className="bg-neutral04 text-white px-6 py-2 rounded-lg shadow-2xl"
            >
              Submitting...
            </button>
          )}

          {status === "deploying" && (
            <button
              disabled
              className="bg-neutral04 text-white px-6 py-2 rounded-lg shadow-2xl"
            >
              Deploying...
            </button>
          )}

          {status === "done" && (
            <button
              onClick={() => setStatus("editing")}
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg shadow-2xl"
            >
              Resubmit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
