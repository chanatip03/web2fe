"use client";

import { Breadcrumbs, Box, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectService } from "@/services/controller";
import { Project } from "@/domain/project";
import { ANONYMOUS_AVATAR_URL } from "@/constants";

const Schema = z.object({
  score: z.string().regex(/^\d+$/, "Score must be a number").min(1, "Score is required"),
  feedback: z.string().optional(),
});

type FormData = z.infer<typeof Schema>;

export default function ScorebookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { isValid } } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      score: "",
      feedback: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjectById(Number(id));
        setProject(data);
        reset({
          score: data.score !== null ? String(data.score) : "",
          feedback: data.feedback || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, reset]);

  const onSubmitForm = async (data: FormData) => {
    if (!project) return;
    try {
      setIsSubmitting(true);
      await projectService.updateProjectGrading(project.id, {
        score: Number(data.score),
        feedback: data.feedback || null,
      });
      alert("Grading saved successfully!");
      // Option: redirect or just stay
    } catch (err: any) {
      console.error("Failed to submit:", err);
      alert("Error saving grading: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ p: 4, color: 'var(--color-accent04)' }}>
        <Typography>{error || "Project not found"}</Typography>
      </Box>
    );
  }

  return (
    <div className="p-3 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start justify-start gap-2 mb-4">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link href="/classroom/listclassroom">Home</Link>
          <span className="text-black">Scorebook and Feedback</span>
        </Breadcrumbs>
      </div>

      <h1 className="mb-3">Scorebook and Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Info */}
        <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
          <Box
            sx={{
              border: "1px solid var(--color-neutral03)",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "var(--color-neutral01)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
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
                gap: 1,
              }}
            >
              {project.students.length > 0 ? (
                project.students.map((student) => (
                  <Box key={student.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={student.user.imageUrl || ANONYMOUS_AVATAR_URL}
                      alt={student.user.first_name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography sx={{ fontWeight: 500 }}>
                      {student.user.first_name} {student.user.last_name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "var(--color-neutral05)", fontStyle: "italic" }}>
                  No students assigned to this project.
                </Typography>
              )}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ px: 4 }}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
}