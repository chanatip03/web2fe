"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
  useSandpack,
} from "@codesandbox/sandpack-react";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { ProjectRepository } from "@/services/project/repository";
import type { FileNode, ProjectSourceCode } from "@/domain/project";

type SandpackFiles = Record<string, { code: string }>;

// ─── helpers ────────────────────────────────────────────────────────────────

function getAllFiles(node: FileNode): FileNode[] {
  if (node.type === "file") return [node];
  return (node.children ?? []).flatMap(getAllFiles);
}

function getIndentStyle(level: number): React.CSSProperties {
  return { paddingLeft: `${level * 16 + 12}px` };
}

// ─── tree node ──────────────────────────────────────────────────────────────

function TreeNode({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [open, setOpen] = useState(true);
  const { sandpack } = useSandpack();

  if (node.type === "file") {
    const fullPath = `/${node.path}`;
    const isActive = sandpack.activeFile === fullPath;

    return (
      <button
        onClick={() => sandpack.setActiveFile(fullPath)}
        style={getIndentStyle(level)}
        className={[
          "flex w-full items-center gap-2 rounded-lg py-[5px] pr-3 text-sm transition-colors",
          isActive
            ? "bg-primary01 text-primary03 font-semibold"
            : "text-black hover:bg-neutral02",
        ].join(" ")}
      >
        <InsertDriveFileIcon
          fontSize="small"
          className="text-gray-400 shrink-0"
        />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  const children = node.children ?? [];

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={getIndentStyle(level)}
        className="flex w-full items-center gap-1 rounded-lg py-[5px] pr-3 text-sm font-semibold transition-colors hover:bg-neutral02"
      >
        {open ? (
          <KeyboardArrowDownIcon
            fontSize="small"
            className="text-neutral04 shrink-0"
          />
        ) : (
          <KeyboardArrowRightIcon
            fontSize="small"
            className="text-neutral04 shrink-0"
          />
        )}
        {open ? (
          <FolderOpenIcon
            fontSize="small"
            className="text-warning01 shrink-0"
          />
        ) : (
          <FolderIcon fontSize="small" className="text-warning01 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {open && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── file explorer ───────────────────────────────────────────────────────────

function FileExplorer({ rootNode }: { rootNode: FileNode }) {
  return (
    <aside className="w-[260px] h-full shrink-0 overflow-y-auto border-r border-neutral02 bg-neutral01">
      <div className="p-2 space-y-0.5">
        {(rootNode.children ?? []).map((child) => (
          <TreeNode key={child.path} node={child} level={0} />
        ))}
      </div>
    </aside>
  );
}

// ─── code panel ──────────────────────────────────────────────────────────────

function PreviewCode() {
  return (
    <section className="flex flex-1 w-screen min-h-0 overflow-hidden bg-white">
      <SandpackLayout className="w-full h-full">
        <div style={{ height: "100%", width: "100%" }}>
          <SandpackCodeViewer
            showTabs={false}
            showLineNumbers
            wrapContent
            initMode="immediate"
          />
        </div>
      </SandpackLayout>
    </section>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function SourceCodeViewer() {
  const params = useParams();
  const projectId = Number(params?.id);

  const [data, setData] = useState<ProjectSourceCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = `sourcecode_${projectId}`;

  useEffect(() => {
    if (!projectId || isNaN(projectId)) {
      setError("Invalid project ID");
      setLoading(false);
      return;
    }

    // ── Check sessionStorage cache first ──────────────────────────────────
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setData(JSON.parse(cached) as ProjectSourceCode);
        setLoading(false);
        return; // ← skip API call
      }
    } catch {
      /* sessionStorage unavailable */
    }

    // ── Fetch from API ────────────────────────────────────────────────────
    const repo = new ProjectRepository();
    repo
      .getProjectSourceCode(projectId)
      .then((result) => {
        setData(result);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
        } catch {
          /* storage quota exceeded — ignore */
        }
      })
      .catch((err: Error) => {
        setError(err.message ?? "Failed to load source code");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-md text-neutral05 bg-white">
        Loading source code…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white">
        <p className="text-sm text-red-500 font-medium">
          {error ?? "Source code unavailable"}
        </p>
      </div>
    );
  }

  const { projectTree, files } = data;

  const allFiles = getAllFiles(projectTree);
  const firstFile = allFiles[0];

  if (!firstFile || Object.keys(files).length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-neutral05 bg-white">
        No source files found.
      </div>
    );
  }

  const activeFile = `/${firstFile.path}`;

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-neutral01">
      <SandpackProvider
        template="static"
        files={files as SandpackFiles}
        options={{
          activeFile,
          visibleFiles: [activeFile],
        }}
      >
        <div className="flex w-full h-full min-h-0 overflow-hidden bg-white">
          <FileExplorer rootNode={projectTree} />
          <PreviewCode />
        </div>
      </SandpackProvider>
    </div>
  );
}
