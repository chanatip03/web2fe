"use client";

import { Button, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StudentRegisterFormProps {
  apiBase: string;
}

const Schema = z.object({
  firstName: z.string().min(1, "Please enter your FirstName"),
  lastName: z.string().min(1, "Please enter your LastName"),
  studentId: z.string().min(1, "Please enter your Student ID"),
  academy: z.string().min(1, "Please enter your Academy"),
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof Schema>;

export default function StudentRegisterForm({ apiBase }: StudentRegisterFormProps) {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentId: "",
      academy: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Register data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary02">
      <div className="bg-neutral01 w-[750px] rounded-2xl shadow-lg px-20 py-14 flex flex-col">

        <div className="flex justify-center">
          <Image
            src="/WEB2LOGO.png"
            alt="WEB2 Logo"
            width={180}
            height={75}
            priority
          />
        </div>

        <h1 className="text-center text-primary03 mb-6">
          Register Student
        </h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3">
            <RHFTextField
              control={control}
              name="firstName"
              label="First Name"
              fullWidth
            />
            <RHFTextField
              control={control}
              name="lastName"
              label="Last Name"
              fullWidth
            />
          </div>

          <RHFTextField
            control={control}
            name="studentId"
            label="Student ID"
            fullWidth
          />

          <RHFTextField
            control={control}
            name="academy"
            label="Academy"
            fullWidth
          />

          <RHFTextField
            control={control}
            name="email"
            label="Email"
            fullWidth
          />

          <RHFTextField
            control={control}
            name="password"
            label="Password"
            type="password"
            fullWidth
          />

          <RHFTextField
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!mt-3"
          >
            Register
          </Button>
        </form>

        <div className="text-center mt-4 p2">
          Already have an account?{" "}
          <Link href="/auth" underline="hover">
            <span className="font-bold text-primary03">
              Login Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
