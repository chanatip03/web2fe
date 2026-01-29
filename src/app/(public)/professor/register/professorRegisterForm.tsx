"use client";

import { Button, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";


interface ProfessorRegisterFormProps {
    apiBase: string;
}

const Schema = z
    .object({
        firstName: z.string().min(1, "Please enter your FirstName"),
        lastName: z.string().min(1, "Please enter your LastName"),
        academy: z.string().min(1, "Please enter your academy"),
        email: z.email({ message: "Invalid email format"}),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof Schema>;

export default function ProfessorRegisterForm({ apiBase }: ProfessorRegisterFormProps) {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { control, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            academy: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: FormData) => {
        if (!selectedFile) {
            alert("Please upload Certificate of Appointment");
            return;
        }

        console.log("Register teacher:", data, selectedFile);
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary02">
            <div className="bg-neutral01 w-[750px] rounded-2xl shadow-lg px-20 py-14 flex flex-col">

                <div className="flex justify-center">
                    <Image
                        src="/WEB2LOGO.png"
                        alt="WEB2 Logo"
                        width={120}
                        height={50}
                        priority
                    />
                </div>

                <h1 className="text-center text-primary03 mb-6">
                    Register Teacher
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

                    <div className="flex items-center gap-2 p2">
                        <span className="whitespace-nowrap">
                            Upload Certificate of Appointment
                            <span className="text-red-500">*</span>
                        </span>

                        <Button
                            variant="outlined"
                            component="label"
                            size="small"
                        >
                            <span>Choose File</span>
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>

                        <span className="text-neutral04 truncate max-w-[200px]">
                            {selectedFile ? selectedFile.name : "No file chosen"}
                        </span>
                    </div>



                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="!mt-6"
                    >
                        Register
                    </Button>
                </form>

                <div className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link href="/auth" underline="hover">
                        <span className="font-bold text-primary03">Login Now</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
