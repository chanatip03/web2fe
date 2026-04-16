"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, IconButton, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";

interface Props {
  open: boolean;
  onClose: () => void;
  testcase?: string;
  assignmentId: string;
  onSaveSuccess?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const Schema = z.object({
  prompt: z.string().optional(),
  testcase: z.string().min(1, "Please generate or enter testcase"),
});

type FormData = z.infer<typeof Schema>;

const TestCaseFormModal = ({ open, onClose, testcase, assignmentId, onSaveSuccess, onSuccess, onError }: Props) => {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!testcase;
  const [canEdit, setCanEdit] = useState(isEditMode);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    defaultValues: {
      prompt: "",
      testcase: "",
    },
  });

  useEffect(() => {
    if (open && testcase) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/assignment/${assignmentId}/testcase`, {
        credentials: "include"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch testcase");
          return res.text();
        })
        .then((text) => {
          setValue("testcase", text, { shouldValidate: true });
        })
        .catch((err) => {
          console.error("Failed to fetch testcase content:", err);

          onError?.("Failed to load testcase.");
        })
        
        .finally(() => setLoading(false));
    } else if (open && !testcase) {
      setValue("testcase", "");
    }
  }, [open, testcase, setValue]);

  const handleClose = () => {
    reset({
      prompt: "",
      testcase: "",
    });

    setCanEdit(isEditMode);
    onClose();
  };

  const handleGenerate = async () => {
    const prompt = watch("prompt");

    if (!prompt) return;
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/testcase/definitions/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setValue("testcase", data.suite_content, {
        shouldValidate: true,
      });

      setCanEdit(true);
      onSuccess?.("Testcase generated successfully.");
    } catch (err) {
      console.error(err);
      onError?.("Failed to generate testcase. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (value: string) => {
    setValue("testcase", value, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const formData = new globalThis.FormData();
      formData.append("content", data.testcase);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/assignment/${assignmentId}/testcase`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save testcase");
      }

      onSaveSuccess?.();
      handleClose();

      onSuccess?.(
        isEditMode
          ? "Testcase updated successfully."
          : "Testcase created successfully.",
      );
    } catch (err) {
      console.error(err);
      onError?.("Failed to save testcase. Please try again later.");
    } finally {
      setLoading(false);
    }
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
            width: 1080,
            borderRadius: "12px",
            maxWidth: "none",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>{isEditMode ? "Edit Testcase" : "Create Testcase"}</h3>

        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col gap-4 py-4 px-8"
        >

          <div className="flex gap-3">
            <RHFTextField
              name="prompt"
              label="What testcase do you want to create?"
              control={control}
              multiline
              rows={3}
              placeholder="Ask AI to generate testcase"
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={16} color="inherit" className="mr-2" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          <div className="border border-neutral03 rounded-lg overflow-hidden">
            <div className="bg-primary03 text-white px-4 py-2">
              Your Testcase
            </div>

            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <CircularProgress size={24} />
                </div>
              )}
              {!watch("testcase") && !canEdit && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral02 text-neutral05 pointer-events-none font-mono">
                  No testcase yet. Please generate from prompt.
                </div>
              )}

              <textarea
                value={watch("testcase")}
                disabled={!canEdit || loading}
                onChange={(e) => handleEdit(e.target.value)}
                className="w-full h-[320px] p-4 outline-none font-mono text-primary03"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || !canEdit || loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={16} color="inherit" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseFormModal;