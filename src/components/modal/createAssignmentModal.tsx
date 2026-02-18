"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";
import { RHFSelect } from "../form/RHFSelect";
import { RHFDateTimePickerDayjs } from "../form/RHFDateTimePicker";
import { IProjectType } from "@/domain/project";
import { ILanguage } from "@/domain/language";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
}

const mockProjectTypes: IProjectType[] = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "Fullstack" },
];

const mockLanguages: ILanguage[] = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "Go" },
  { id: 4, name: "Java" },
];


const Schema = z.object({
  name: z.string().min(1, "Please enter assignment name"),
  detail: z.string().optional(),
  assignmentType: z.string().min(1, "Please select assignment type"),
  projectTypeId: z.number().min(1, "Please select project type"),
  languageId: z.number().optional(),
  publishDate: z
  .string()
    .min(1, "Please select publishDate date")
    .refine((val) => dayjs(val).isValid(), {
      message: "Invalid date format",
    }),
  dueDate: z
  .string()
    .min(1, "Please select dueDate date")
    .refine((val) => dayjs(val).isValid(), {
      message: "Invalid date format",
    }),
  testCase: z.any().optional(),
  attachment: z.any().optional(),
});

type FormData = z.infer<typeof Schema>;

const CreateAssignmentModal = ({ open, onClose }: Props) => {
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
      name: "",
      detail: "",
      assignmentType: "",
      projectTypeId: undefined,
      languageId: undefined,
      publishDate: undefined,
      dueDate: undefined,
      testCase: null,
      attachment: null,
    },
  });

  const projectTypeId = watch("projectTypeId");

  const enableLanguage =
    projectTypeId === 1 || projectTypeId === 2;

  useEffect(() => {
    if (!enableLanguage) {
      setValue("languageId", undefined);
    }
  }, [enableLanguage, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    handleClose();
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
            width: 920,
            borderRadius: "12px",
            maxWidth: "none",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >

      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>Create Assignment</h3>

        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex-col gap-3 py-4 px-8"
        >
          <RHFTextField
            name="name"
            control={control}
            label="Assignment name"
            fullWidth
          />

          <RHFTextField
            name="detail"
            control={control}
            label="Assignment detail"
            multiline
            rows={4}
            fullWidth
          />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <RHFSelect
              name="assignmentType"
              control={control}
              label="Assignment Type"
            >
              <MenuItem value="individual">
                Individual
              </MenuItem>

              <MenuItem value="group">
                Group
              </MenuItem>
            </RHFSelect>

            <RHFSelect
              name="projectTypeId"
              control={control}
              label="Project type"
            >
              {mockProjectTypes.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </MenuItem>
              ))}
            </RHFSelect>

             <RHFSelect
              name="languageId"
              control={control}
              label="Language"
              disabled={!enableLanguage}
            >

              {mockLanguages.map((item) => (

                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </MenuItem>

              ))}

            </RHFSelect>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <RHFDateTimePickerDayjs
              name="publishDate"
              control={control}
              label="Publish date"
            />

            <RHFDateTimePickerDayjs
              name="dueDate"
              control={control}
              label="Due date"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-2">
             <h4 className="m-0">Test case</h4>
              <p className="p2 m-0">(optional)</p>
            </span>

            <Button
              variant="outlined"
              component="label"
              sx={{ height: 32 }}
            >
              <span>Add File</span>
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setValue(
                    "testCase",
                    e.target.files?.[0]
                  )
                }
              />
            </Button>

            <p className="text-neutral03 p2 truncate max-w-[400px]">
              {watch("testCase")?.name ??
                "No file chosen"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <h4 className="m-0">Attachments</h4>
              <p className="p2 m-0">(optional)</p>
            </span>
            <Button
              variant="outlined"
              component="label"
              sx={{ height: 32 }}
            >
              <span>Add File</span>
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setValue(
                    "attachment",
                    e.target.files?.[0]
                  )
                }
              />
            </Button>

            <p className="text-neutral03 p2 truncate max-w-[400px]">
              {watch("attachment")?.name ??
                "No file chosen"}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentModal;