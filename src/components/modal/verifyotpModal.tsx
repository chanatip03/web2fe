"use client";

import { Dialog, DialogContent, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { authService } from "@/services/controller";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  email: string;
  onClose: () => void;
}

const VerifyOtpModal = ({ open, email, onClose }: Props) => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    try {
      console.log(email, otp);
      const res = await authService.verifyOTP({
        email: email,
        otp: otp,
      });

      console.log(res);
      onClose();
      router.push("/auth");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex justify-between items-center p-4">
        <h3>Enter your OTP code</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>
        <p className="mb-4 text-sm">
          Verify email: <b>{email}</b>
        </p>

        {/* 🔥 simple input */}
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter OTP"
        />

        <Button variant="contained" fullWidth onClick={onSubmit}>
          Verify OTP
        </Button>

        <Button variant="text" fullWidth onClick={onClose}>
          Back
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
