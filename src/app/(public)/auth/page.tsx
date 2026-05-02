"use client";

import { useState } from "react";
import { Button, Alert, Snackbar, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/controller";
import ResetPasswordModal from "@/components/modal/resetPasswordModal";

const Schema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(1, "Please enter your password"),
});

type FormData = z.infer<typeof Schema>;
export const dynamic = "force-dynamic";

export default function Auth() {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Incorrect email or password.");
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await authService.login(data);
      if (response) {
        router.push("/classroom");
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Incorrect email or password.";
      setErrorMessage(message);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert severity="error" onClose={() => setIsError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <div className="w-1/2 bg-secondary02 flex items-center justify-center">
        <div className="relative w-125 h-125">
          <Image
            src="/logo.png"
            alt="WEB2 Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <form
          className="w-150 flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-primary03 mb-6">Welcome back!</h1>

          <RHFTextField
            control={control}
            name="email"
            label="Email"
            fullWidth
          />

          <div className="mb-4">
            <RHFTextField
              control={control}
              name="password"
              label="Password"
              type="password"
              fullWidth
            />

            <div className="text-right">
              <Link
                href="#"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenResetPassword(true);
                }}
              >
                <h5 className="text-primary03">Forgot password</h5>
              </Link>
            </div>
          </div>

          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>

          <div className="flex justify-center items-center gap-2 text-center p2">
            <span>If you don&apos;t have an account, register as</span>

            <Link href="/register?role=student">
              <span className="font-bold text-primary03">Student</span>
            </Link>

            <span>or</span>

            <Link href="/register?role=teacher">
              <span className="font-bold text-primary03">Teacher</span>
            </Link>
          </div>
        </form>
      </div>
      <ResetPasswordModal
        open={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
      />
    </div>
  );
}
