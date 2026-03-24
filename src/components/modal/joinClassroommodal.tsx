"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { classroomService, classroomMemberService } from "@/services/controller";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JoinClassroomModal({
  open,
  onClose,
  onSuccess,
}: Readonly<Props>) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setCode("");
      setError("");
    }
  }, [open]);

  const onSubmit = async () => {
    if (!code.trim()) {
      setError("Please enter classroom code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      try {
        await classroomMemberService.joinClassroom(code);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        return;
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {/* HEADER */}
      <div className="flex justify-between items-center p-5">
        <h3 className="font-bold">Join Classroom</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent sx={{ pt: 0.5, pb: 1 }}>
        <TextField
          autoFocus
          label="Classroom Code"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter classroom code"
          margin="normal"
        />

        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Join"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
