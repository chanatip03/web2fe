"use client";

import { useState } from "react";
import { Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

interface CertificatePreviewProps {
  url: string;
  label?: string;
}

export default function CertificatePreview({ url, label = "Certificate" }: CertificatePreviewProps) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <Tooltip title={`View ${label}`}>
        <button
          type="button"
          onClick={() => { setOpen(true); setImgError(false); }}
          className="inline-flex items-center gap-1 text-primary03 font-medium text-sm hover:underline cursor-pointer bg-transparent border-0 p-0"
        >
          <FindInPageOutlinedIcon style={{ fontSize: 18 }} />
          {label}
        </button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: "12px", overflow: "visible" },
          },
        }}
      >
        {/* Header bar matching other admin modals */}
        <div className="flex items-center justify-between bg-primary03 px-8 py-3 text-white rounded-t-xl">
          <h3>{label}</h3>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon className="text-white" />
          </IconButton>
        </div>

        <DialogContent sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
          {imgError ? (
            <div className="flex flex-col items-center gap-3 text-neutral04 py-12">
              <BrokenImageOutlinedIcon sx={{ fontSize: 64, color: "var(--color-neutral03)" }} />
              <p className="text-sm">ไม่สามารถแสดงรูปได้ กรุณาเปิดลิงก์โดยตรง</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-primary03 text-sm underline"
              >
                เปิดในแท็บใหม่
              </a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={label}
              onError={() => setImgError(true)}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: 4,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
