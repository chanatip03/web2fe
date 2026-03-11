"use client";

import { Breadcrumbs, Box, Typography, Avatar, Button } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";

const Schema = z.object({
  score: z.string().regex(/^\d+$/, "Score must be a number").min(1, "Score is required"),
  feedback: z.string().optional(),
});

type FormData = z.infer<typeof Schema>;

export default function ScorebookPage() {
  const students = [
    {
      id: "1",
      name: "Tula patanaboonmee",
      avatarUrl: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: "2",
      name: "John Doe",
      avatarUrl: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: "3",
      name: "Jane Smith",
      avatarUrl: "https://i.pravatar.cc/100?img=5",
    }
  ];

  const { control, handleSubmit, formState: { isValid } } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      score: "",
      feedback: "",
    },
    mode: "onChange",
  });

  const onSubmitForm = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: implement backend submit here
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" separator="/">
            <Link href="/classroom/listclassroom">Home</Link>
            <Link href="/classroom/listclassroom">Web programming</Link>
            <Link href="/assignment">Assignment</Link>
            <span >Final Project</span>
            <span >G. Zhì Shèng Háo</span>
            <span className="text-black">Scorebook and Feedback</span>
        </Breadcrumbs>

      <h1 className="mb-3 my-6">Scorebook and Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Info */}
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
          <Box
            sx={{
              border: "1px solid var(--color-neutral03)",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "var(--color-neutral01)",
              boxShadow: "0 5px 10px 5px rgba(0,0,0,0.05)"
            }}
          >
            <Box
              sx={{
                backgroundColor: "var(--color-primary03)",
                color: "var(--color-neutral01)",
                py: 2,
                px: 3,
                fontWeight: 600,
                fontSize: "var(--text-p1)",
              }}
            >
              Students
            </Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {students.map((student) => (
                <Box key={student.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={student.avatarUrl} alt={student.name} sx={{ width: 40, height: 40 }} />
                  <Typography sx={{ fontWeight: 500 }}>{student.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </div>

        {/* Right Column: Score & Feedback Form */}
        <div className="md:col-span-8 lg:col-span-8 xl:col-span-9">
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-6">
            <Box sx={{ width: "250px" }}>
              <RHFTextField
                name="score"
                control={control}
                size="small"
                fullWidth
                label={`Score`}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            <RHFTextField
              name="feedback"
              control={control}
              label={`Feedback`}
              multiline
              rows={12}
              fullWidth
            />
            
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4 }} disabled={!isValid}>
                Submit
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
}