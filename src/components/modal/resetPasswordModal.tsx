"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";

interface Props {
  open: boolean;
  email?: string;
  onClose: () => void;
  onConfirm?: (data: { otp: string; newPassword: string }) => void;
  onResend?: () => void;
}

const Schema = z
  .object({
    code0: z.string().min(1, "").max(1, ""),
    code1: z.string().min(1, "").max(1, ""),
    code2: z.string().min(1, "").max(1, ""),
    code3: z.string().min(1, "").max(1, ""),
    code4: z.string().min(1, "").max(1, ""),
    code5: z.string().min(1, "").max(1, ""),
    newPassword: z
      .string()
      .min(8, "Your password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Your password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof Schema>;

const ResetPasswordModal = ({
  open,
  email,
  onClose,
  onConfirm,
  onResend,
}: Props) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: {
      code0: "",
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  // จัดการตอนพิมพ์ OTP ทีละช่อง โดยรับเฉพาะตัวเลข เก็บได้แค่ 1 ตัว ถ้ากรอกแล้วให้เลื่อนไปช่องถัดไปอัตโนมัติ
  const handleCodeChange = (
    index: number,
    value: string,
    onChange: (value: string) => void,
  ) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 1);
    onChange(cleanValue);

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // เลื่อนไปช่องถัดไป ก่อนหน้าของ otp โดยใช้ keyboard 
  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const currentValue = watch(`code${index}` as keyof FormData) as string;

    if (e.key === "Backspace" && !currentValue && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // รองรับการ paste OTP หลายหลักครั้งเดียว เช่น paste 123456 แล้วกระจายลงช่องอัตโนมัติ
  const handleCodePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (!digits) return;

    e.preventDefault();

    for (let i = 0; i < digits.length && index + i < 6; i += 1) {
      setValue(`code${index + i}` as keyof FormData, digits[i], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    const nextIndex = Math.min(index + digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // รวม OTP จาก 6 ช่องให้เป็น string เดียว แล้วส่งออกไป
  const onSubmit = (data: FormData) => {
    const otp = `${data.code0}${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}`;

    onConfirm?.({
      otp,
      newPassword: data.newPassword,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      slotProps={{
        paper: {
          sx: {
            width: 740,
            maxWidth: "none",
            overflow: "hidden",
          },
        },
      }}
    >
      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>Reset Password</h3>
        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 px-6 py-3"
        >
          <div>
            <h4 className="mb-2">Verification Code</h4>

            <p className="p2">
              A 6-digit code has been sent to <span>{email}</span>. Please enter
              the code below.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <Controller
                    name={`code${index}` as keyof FormData}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value, field.onChange)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          handleCodeKeyDown(e, index)
                        }
                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                          handleCodePaste(e, index)
                        }
                        slotProps={{
                          htmlInput: {
                            maxLength: 1,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              padding: "0",
                              height: "54px",
                              width: "54px",
                              fontSize: "18px",
                            },
                          },
                        }}
                        sx={{
                          width: "54px",
                          height: "54px",
                        }}
                      />
                    )}
                  />

                 {index < 5 && ( <span className="mb-2 h-[2px] w-2 rounded-full bg-neutral04" />)}
                </div>
              ))}
            </div>

            <Button type="button" variant="contained" onClick={onResend}>
              Resend
            </Button>
          </div>

          <div className="border-b border-neutral06" />

          <div>
            <h4 className="mb-2">Create your new password</h4>
            <p className="p2">
              Your new password should be at least 8 characters
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <RHFTextField
              name="newPassword"
              control={control}
              label="New password"
              type="password"
              fullWidth
            />

            <RHFTextField
              name="confirmPassword"
              control={control}
              label="Confirm new password"
              type="password"
              fullWidth
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
              color="error"
            >
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={!isValid}>
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;