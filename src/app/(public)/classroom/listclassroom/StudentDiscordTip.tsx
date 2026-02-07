"use client";

import { useState } from "react";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/material";

interface Props {
  role: "student" | "teacher";
}

export default function StudentDiscordTip({ role }: Props) {
  const [open, setOpen] = useState(true);

  // แสดงเฉพาะนักศึกษา
  if (role !== "student") return null;

  return (
    <>
      {/* POPUP BOX */}
      {open && (
        <div className="fixed bottom-28 right-8 w-[380px] bg-white border border-primary03 rounded-2xl shadow-xl p-5 animate-fade-in z-50">
          <div className="flex justify-between items-start gap-3">
            <div className="flex gap-3">
              <div className="bg-primary01 text-primary03 rounded-lg p-2 w-10 h-10 flex items-center justify-center shrink-0 self-start">
                <NotificationsNoneRoundedIcon fontSize="small"/>
              </div>
              <p className="text-sm text-neutral05 leading-relaxed">
                You can enable <span className="font-semibold">Discord notifications</span> for work review updates by linking your Discord account in your profile settings
              </p>
            </div>

            <IconButton size="small" onClick={() => setOpen(true)}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary03 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition z-50"
      >
        <NotificationsNoneRoundedIcon fontSize="medium"/>
      </button>
    </>
  );
}
