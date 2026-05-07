"use client";

import React from "react";
import { Dialog, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { CreateClassRoomRequest } from "@/domain/classroom";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassRoomRequest) => Promise<void>;
}

const Schema = z.object({
  name: z.string().min(1, "Please enter a classroom name"),
  semester: z
    .string()
    .regex(/^[12s]\/(2\d{3})$/, "Format must be like 2/2566 or 2/2025"),
  description: z.string().optional(),
  learningOutcomes: z
    .array(
      z.object({
        value: z.string().min(1),
      }),
    )
    .optional(),
});

type FormData = z.infer<typeof Schema>;

const CreateClassroomModal = ({ open, onClose, onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      semester: "",
      description: "",
      learningOutcomes: [{ value: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "learningOutcomes",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: FormData) => {
    const payload = {
      name: data.name,
      semester: data.semester,
      description: data.description ?? "",
      learningoutcomes:
        data.learningOutcomes
          ?.map((item) => item.value.trim())
          .filter(Boolean)
          .join("|") || "",
    };
    try {
      await onSubmit(payload);
      handleClose();
    } catch {}
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            width: 920,
            height: 700,
            maxWidth: "none",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>Create Classroom</h3>
        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent className="flex-1 overflow-hidden ">
        <form
          className="flex h-full flex-col gap-2 py-4 px-8"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="flex gap-4">
            <div className="flex-3">
              <RHFTextField
                name="name"
                control={control}
                label="Classroom Name"
                size="small"
                fullWidth
                placeholder="Enter classroom name"
              />
            </div>
            <div className="flex-1">
              <RHFTextField
                name="semester"
                control={control}
                label="Semester"
                size="small"
                fullWidth
                placeholder="Enter semester/year eg. 2/2566 or 2/2025"
              />
            </div>
          </div>

          <RHFTextField
            name="description"
            control={control}
            label="Classroom Description"
            multiline
            rows={4}
            fullWidth
            placeholder="Enter classroom description"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4>Learning Outcomes</h4>
              <IconButton
                type="button"
                onClick={() => append({ value: "" })}
                sx={{ color: "var(--color-primary03)" }}
              >
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </div>

            <div className="max-h-[220px] overflow-y-auto pt-2 ">
              {fields.map((field, index) => (
                <div key={field.id} className="mb-2 flex items-start gap-2">
                  <RHFTextField
                    name={`learningOutcomes.${index}.value`}
                    control={control}
                    label={`Learning Outcome ${index + 1}`}
                    size="small"
                    fullWidth
                    placeholder={`Enter learning outcome ${index + 1}`}
                  />

                  <IconButton
                    type="button"
                    sx={{
                      color: "var(--color-accent03)",
                      mt: "2px",
                    }}
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-4">
            <Button type="submit" variant="contained" disabled={!isValid}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomModal;
