"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";
import { authService, userService } from "@/services/controller";


const EmailSchema = z.object({
  email: z.string().email("Invalid email"),
});

const OtpSchema = z.object({
  code0: z.string().length(1),
  code1: z.string().length(1),
  code2: z.string().length(1),
  code3: z.string().length(1),
  code4: z.string().length(1),
  code5: z.string().length(1),
});

const PasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type EmailForm = z.infer<typeof EmailSchema>;
type OtpForm = z.infer<typeof OtpSchema>;
type PasswordForm = z.infer<typeof PasswordSchema>;

type Step = "email" | "otp" | "password";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ResetPasswordModal = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });


  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });


  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(OtpSchema),
    mode: "onChange",
    defaultValues: {
      code0: "",
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
    },
  });


  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
  });

  const { setValue, watch } = otpForm;

  useEffect(() => {
    if (!open) {
      setStep("email");
      emailForm.reset();
      otpForm.reset();
      passwordForm.reset();
    }
  }, [open]);

  // จัดการตอนพิมพ์ OTP ทีละช่อง โดยรับเฉพาะตัวเลข เก็บได้แค่ 1 ตัว ถ้ากรอกแล้วให้เลื่อนไปช่องถัดไปอัตโนมัติ
  const handleCodeChange = (
    index: number,
    value: string,
    onChange: (value: string) => void,
  ) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 1);
    onChange(cleanValue);

    if (cleanValue && index < 5) {
      focusAndMoveCursorToEnd(index + 1);
    }
  };

const focusAndMoveCursorToEnd = (index: number) => {
  const el = inputRefs.current[index];
  if (el) {
    el.focus();

    const length = el.value.length;

    setTimeout(() => {
      el.setSelectionRange(length, length);
    }, 0);
  }
};

  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    index: number,
  ) => {
    const currentValue = watch(`code${index}` as keyof OtpForm) as string;

    if (e.key === "Backspace") {
      if (currentValue) {
        setValue(`code${index}` as keyof OtpForm, "");
      } else if (index > 0) {
        focusAndMoveCursorToEnd(index - 1);
        setValue(`code${index - 1}` as keyof OtpForm, "");
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      focusAndMoveCursorToEnd(index - 1);
    }

    if (e.key === "ArrowRight" && index < 5) {
      focusAndMoveCursorToEnd(index + 1);
    }
  };

  // รองรับการ paste OTP หลายหลักครั้งเดียว เช่น paste 123456 แล้วกระจายลงช่องอัตโนมัติ
  const handleCodePaste = (
    e: React.ClipboardEvent<HTMLElement>,
    index: number,
  ) => {
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (!digits) return;

    e.preventDefault();

    for (let i = 0; i < digits.length && index + i < 6; i++) {
      setValue(`code${index + i}` as keyof OtpForm, digits[i], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    const nextIndex = Math.min(index + digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };


  const handleClose = () => {
    setStep("email");
    setEmail("");

    emailForm.reset();
    otpForm.reset();
    passwordForm.reset();

    onClose();
  };

  const handleSendOtp = async (data: EmailForm) => {
    setEmail(data.email);
    await authService.requestResetPasswordOTP(data.email);
    setStep("otp");

    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleVerifyOtp = async (data: OtpForm) => {
    const otp =
      data.code0 +
      data.code1 +
      data.code2 +
      data.code3 +
      data.code4 +
      data.code5;

    const response = await authService.verifyOTP({ email, otp });
    if (response) setStep("password");
  };

  const handleResetPassword = async (data: PasswordForm) => {
    try {
      await userService.resetPassword({
        email,
        new_password: data.newPassword,
      });

      handleClose();

      setSnackbar({
        open: true,
        message: "Reset password successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      
      setSnackbar({
        open: true,
        message: "Failed to reset password.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick") return;
          handleClose();
        }}
        slotProps={{
          paper: { sx: { width: 550 , height: 330} },
        }}
      >
        <div className="flex items-center justify-between bg-primary03 px-10 py-3 text-white">
          <h4>
            {step === "email" && "Reset Password"}
            {step === "otp" && "Enter verification code"}
            {step === "password" && "Create a new password"}
          </h4>

          <IconButton onClick={handleClose}>
            <CloseIcon className="text-white" />
          </IconButton>
        </div>

        <DialogContent>
          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(handleSendOtp)}
              className="flex flex-col gap-4 px-4 py-4"
            >
              <p className="p2">
                Enter your email to receive OTP for resetting password.
              </p>

              <RHFTextField
                name="email"
                control={emailForm.control}
                label="Email"
                fullWidth
              />

              <Button type="submit" variant="contained">
                Send OTP
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
              className="flex flex-col gap-4 px-4 pb-4"
            >
              <p className="p2">
                The verification code has been sent to your email <b>{email}</b>
              </p>

              <div className="flex gap-4 justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Controller
                    key={i}
                    name={`code${i}` as keyof OtpForm}
                    control={otpForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={(el) => (inputRefs.current[i] = el)}
                        onChange={(e) =>
                          handleCodeChange(i, e.target.value, field.onChange)
                        }
                        onKeyDown={(e) => handleCodeKeyDown(e, i)}
                        onPaste={(e) => handleCodePaste(e, i)}
                        slotProps={{
                          htmlInput: {
                            maxLength: 1,
                            inputMode: "numeric",
                            style: {
                              textAlign: "center",
                              width: 35,
                              height: 40,
                            },
                          },
                        }}
                      />
                    )}
                  />
                ))}
              </div>

              <Button type="submit" variant="contained">
                Verify OTP
              </Button>
            </form>
          )}

          {step === "password" && (
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="flex flex-col gap-2 px-4 py-4"
            >

              <RHFTextField
                name="newPassword"
                control={passwordForm.control}
                label="New password"
                type="password"
                fullWidth
              />

              <RHFTextField
                name="confirmPassword"
                control={passwordForm.control}
                label="Confirm password"
                type="password"
                fullWidth
              />

              <Button type="submit" variant="contained" className="mt-2" disabled={!passwordForm.formState.isValid}>
                Reset Password
              </Button>
            </form>
          )}
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

export default ResetPasswordModal;