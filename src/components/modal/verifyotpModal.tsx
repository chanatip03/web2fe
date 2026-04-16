"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Alert,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { authService } from "@/services/controller";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  email: string;
  onClose: () => void;
  otpRequestedAt?: number;
}

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 5 * 60;

const VerifyOtpModal = ({ open, email, onClose, otpRequestedAt }: Props) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(OTP_EXPIRY_SECONDS);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setOtp("");
      setError("");
      setRemainingSeconds(OTP_EXPIRY_SECONDS);
      setIsExpired(false);
      setLoading(false);
      return;
    }

    const now = Date.now();
    const requestTime = otpRequestedAt || now;
    const elapsed = Math.floor((now - requestTime) / 1000);
    const remaining = Math.max(0, OTP_EXPIRY_SECONDS - elapsed);

    setOtp("");
    setError("");
    setRemainingSeconds(remaining);
    setIsExpired(remaining === 0);
  }, [open, otpRequestedAt]);

  useEffect(() => {
    if (!open || isExpired) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [open, isExpired]);

  const handleOtpChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(sanitized);

    if (error) {
      setError("");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async () => {
    if (isExpired) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      setError(`OTP must be ${OTP_LENGTH} digits.`);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authService.verifyOTP({
        email,
        otp,
      });

      onClose();
      router.push("/auth");
    } catch (err: any) {
      const message = err?.message || "Failed to verify OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <div className="flex justify-between items-center p-4">
        <h3>Enter your OTP code</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>
        <p className="mb-2 text-sm">
          Verify email: <b>{email}</b>
        </p>

        <Typography
          variant="body2"
          sx={{ color: isExpired ? "error.main" : "text.secondary" }}
          className="mb-4"
        >
          {isExpired
            ? "OTP has expired. Please request a new code."
            : `OTP expires in ${formatTimer(remainingSeconds)}`}
        </Typography>

        <TextField
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          label="OTP"
          placeholder="Enter 6-digit OTP"
          fullWidth
          inputProps={{ maxLength: OTP_LENGTH, inputMode: "numeric", pattern: "[0-9]*" }}
          margin="normal"
        />

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      </DialogContent>

      <DialogActions className="flex flex-col gap-2 px-4 pb-4">
        <Button variant="contained" fullWidth onClick={onSubmit} disabled={loading || isExpired}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button variant="text" fullWidth onClick={onClose}>
          Back
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyOtpModal;
