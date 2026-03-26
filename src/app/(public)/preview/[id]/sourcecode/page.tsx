"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type FileNode = {
  name: string;
  type: "file" | "folder";
  path: string;
  url?: string;
  children?: FileNode[];
};

type SandpackFiles = Record<string, { code: string }>;

//Mock tree
const projectTree: FileNode = {
  name: "root",
  type: "folder",
  path: "",
  children: [
    {
      name: "src",
      type: "folder",
      path: "src",
      children: [
        {
          name: "App.tsx",
          type: "file",
          path: "src/App.tsx",
          url: "https://raw.githubusercontent.com/AnukoolBaiban/GoSmooth-WebPro2/main/frontend/src/App.tsx",
        },
        {
          name: "main.tsx",
          type: "file",
          path: "src/main.tsx",
          url: "https://raw.githubusercontent.com/AnukoolBaiban/GoSmooth-WebPro2/main/frontend/src/main.tsx",
        },
      ],
    },
    {
      name: "index.html",
      type: "file",
      path: "index.html",
      url: "https://raw.githubusercontent.com/AnukoolBaiban/GoSmooth-WebPro2/main/frontend/index.html",
    },
  ],
};

//helper

function getAllFiles(node: FileNode): FileNode[] {
  if (node.type === "file") return [node];
  return (node.children || []).flatMap(getAllFiles);
}

async function buildFiles(root: FileNode): Promise<SandpackFiles> {
  const fileNodes = getAllFiles(root);

  const entries = await Promise.all(
    fileNodes.map(async (file) => {
      try {
        const res = await fetch(file.url || "");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        return [`/${file.path}`, { code: text }] as const;
      } catch (error) {
        return [
          `/${file.path}`,
          {
            code: `// Failed to load ${file.path}\n// ${(error as Error).message
              }`,
          },
        ] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}

//Indent
function getIndentClass(level: number) {
  const map: Record<number, string> = {
    0: "pl-3",
    1: "pl-7",
    2: "pl-11",
    3: "pl-15",
    4: "pl-20",
  };
  return map[level] || "pl-24";
}

//Tree
function TreeNode({
  node,
  level = 0,
}: {
  node: FileNode;
  level?: number;
}) {
  const [open, setOpen] = useState(true);
  const { sandpack } = useSandpack();

  const indent = getIndentClass(level);

  if (node.type === "file") {
    const fullPath = `/${node.path}`;
    const isActive = sandpack.activeFile === fullPath;

    return (
      <button
        onClick={() => sandpack.setActiveFile(fullPath)}
        className={[
          "flex w-full items-center gap-2 rounded-lg py-2 pr-3 text-sm transition-colors",
          indent,
          isActive
            ? "bg-primary01 text-primary03 font-semibold"
            : "text-black hover:bg-neutral02",
        ].join(" ")}
      >
        <InsertDriveFileIcon fontSize="small" className="text-gray-500" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "flex w-full items-center gap-1 rounded-lg py-2 pr-3 text-sm font-semibold transition-colors hover:bg-neutral02",
          indent,
        ].join(" ")}
      >
          <KeyboardArrowDownIcon fontSize="small" className="text-neutral04" />

        {open ? (
          <FolderOpenIcon fontSize="small" className="text-warning01" />
        ) : (
          <FolderIcon fontSize="small" className="text-warning01" />
        )}

        <span className="truncate">{node.name}</span>
      </button>

      {open && (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}


function FileExplorer() {
  return (
    <aside className="w-[260px] overflow-y-auto border-r border-neutral02 bg-neutral01">
      <div className="p-2">
        <TreeNode node={projectTree} />
      </div>
    </aside>
  );
}

function PreviewCode() {
  return (
    <section className="flex flex-1 flex-col h-screen">
      <SandpackLayout>
        <div className="flex flex-1 h-screen overflow-y-auto
                    [&_code]:!text-[16px]">
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


export default function SourceCodeViewer() {
  const [files, setFiles] = useState<SandpackFiles | null>(null);

  const firstFile = useMemo(() => getAllFiles(projectTree)[0], []);

  useEffect(() => {
    buildFiles(projectTree).then(setFiles);
  }, []);

if (!files || !firstFile) {
  return (
    <div className="flex h-full w-full items-center justify-center text-md text-neutral05 bg-[#ffffff]">
      Loading source code...
    </div>
  );
}
  return (
    <div className="w-full overflow-hidden bg-neutral01">
      <SandpackProvider
        template="static"
        files={files}
        options={{
          activeFile: `/${firstFile.path}`,
          visibleFiles: [`/${firstFile.path}`],
        }}
      >
        <div className="flex w-full overflow-hidden bg-white">
          <FileExplorer />
          <PreviewCode />
        </div>
      </SandpackProvider>
    </div>
  );
}