"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";
import { userService } from "@/services/controller";

const Schema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type FormData = z.infer<typeof Schema>;

interface Props {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: Props) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });
    const {
        control,
        handleSubmit,
        reset,
        formState: { isValid, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(Schema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const submit = async (data: FormData) => {
        try {
            const payload = {
                old_password: data.currentPassword,
                new_password: data.newPassword,
            };

            await userService.changePassword(payload);
            setSnackbar({
                open: true,
                message: "Password changed successfully.",
                severity: "success",
            });

            handleClose();
        } catch (err) {
            console.error("Change password failed:", err);
            setSnackbar({
                open: true,
                message: "Failed to change password. Please try again later.",
                severity: "error",
            });
        }
    };

    return (
        <>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <div className="flex items-center justify-between bg-primary03 px-10 py-3 text-white">
                <h4>Change Password</h4>
                <IconButton onClick={handleClose}>
                    <CloseIcon className="text-white" />
                </IconButton>
            </div>

            <DialogContent>
                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3 px-4 pt-3 pb-4">
                    <RHFTextField
                        name="currentPassword"
                        control={control}
                        label="Current Password"
                        type="password"
                        fullWidth
                    />

                    <RHFTextField
                        name="newPassword"
                        control={control}
                        label="New Password"
                        type="password"
                        fullWidth
                    />

                    <RHFTextField
                        name="confirmPassword"
                        control={control}
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={handleClose} variant="outlined" color="error">
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid || isSubmitting}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="standard"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
        </>
    );
};

export default ChangePasswordModal;