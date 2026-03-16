"use client";

import { useState } from "react";
import { Dialog, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";

interface Props {
  open: boolean;
  onClose: () => void;
  testcase?: string;
}

const Schema = z.object({
  prompt: z.string().optional(),
  testcase: z.string().min(1, "Please generate or enter testcase"),
});

type FormData = z.infer<typeof Schema>;

const TestCaseFormModal = ({ open, onClose, testcase }: Props) => {
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
      testcase: testcase || "",
    },
  });

  const handleClose = () => {
    reset({
      prompt: "",
      testcase: testcase || "",
    });

    setCanEdit(isEditMode);
    onClose();
  };

  const handleGenerate = async () => {
    const prompt = watch("prompt");

    if (!prompt) return;
    try {
      setLoading(true);

      const generated = `*** Settings ***
      Library    SeleniumLibrary
      Suite Setup    Open Calculator Browser
      Suite Teardown    Close All Browsers 

      *** Test Cases **
      # Basic arithmetic (1-10)
      TC 001 Addition: 2 + 3 = 5
      [Tags]    addition    basic
      Clear And Open
      Press Buttons    2 + 3 =
      Display Should Be    5

      TC 002 Subtraction: 7 - 4 = 3
      [Tags]    subtraction    basic
      Clear And Open
      Press Buttons    7 - 4 = 3`; //mock

      setValue("testcase", generated, {
        shouldValidate: true,
      });

      setCanEdit(true);
    } catch (err) {
      console.error(err);
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
      handleClose();
    } catch (err) {
      console.error(err);
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
              Generate
            </Button>
          </div>

          <div className="border border-neutral03 rounded-lg overflow-hidden">
            <div className="bg-primary03 text-white px-4 py-2">
              Your Testcase
            </div>

            <div className="relative">
              {!watch("testcase") && !canEdit && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral02 text-neutral05 pointer-events-none font-mono">
                  No testcase yet. Please generate from prompt.
                </div>
              )}

              <textarea
                value={watch("testcase")}
                disabled={!canEdit}
                onChange={(e) => handleEdit(e.target.value)}
                className="w-full h-[320px] p-4 outline-none font-mono text-primary03"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || !canEdit}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseFormModal;