"use client";

import { useEffect, useState } from "react";
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
import { ProjectType, Language } from "@/domain/assignment";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { assignmentService } from "@/services/controller";
import ConfirmNoTestCaseModal from "./confirmCreateAssignmentModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const mockProjectTypes: ProjectType[] = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "Project" },
];

const mockLanguages: Language[] = [
  { id: 1, name: "Java" },
  { id: 2, name: "Python" },
  { id: 3, name: "C" },
  { id: 4, name: "C++" },
  { id: 5, name: "JavaScript" },
  { id: 6, name: "TypeScript" },
  { id: 7, name: "Go" },
  { id: 8, name: "Kotlin" },
  { id: 9, name: "Swift" },
  { id: 10, name: "Rust" },
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
  attachment: z.array(z.instanceof(File)).optional(),
  testCase: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof Schema>;

const CreateAssignmentModal = ({ open, onClose }: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const params = useParams();
  const id = params.id;

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
      testCase: undefined,
      attachment: [],
    },
  });

  const projectTypeId = watch("projectTypeId");

  const attachments = watch("attachment") ?? [];

  const enableLanguage = projectTypeId === 1 || projectTypeId === 2;

  useEffect(() => {
    if (!enableLanguage) {
      setValue("languageId", undefined);
    }
  }, [enableLanguage, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (!data.testCase) {
      setPendingData(data);
      setOpenConfirm(true);
      return;
    }

    if (data.projectTypeId === 3) {
      delete data.languageId;
    }

    await handleCreate(data);
  };

  const handleCreate = async (data: FormData) => {
    try {
      const payload = {
        title: data.name,
        description: data.detail ?? "",
        start_date: dayjs(data.publishDate).toISOString(),
        due_date: dayjs(data.dueDate).toISOString(),
        is_group: data.assignmentType === "group",
        project_type_id: data.projectTypeId,
        language_id: data.languageId ?? undefined,
        classroom_id: Number(id),
      };

      await assignmentService.createAssignment(
        payload,
        data.testCase ?? undefined,
        data.attachment ?? [],
      );

      handleClose();
      setOpenConfirm(false);
      setPendingData(null);
    } catch (err) {
      console.error(err);
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
              <MenuItem value="individual">Individual</MenuItem>

              <MenuItem value="group">Group</MenuItem>
            </RHFSelect>

            <RHFSelect
              name="projectTypeId"
              control={control}
              label="Project type"
            >
              {mockProjectTypes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
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
                <MenuItem key={item.id} value={item.id}>
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

            <Button variant="outlined" component="label" sx={{ height: 32 }}>
              <span>Add File</span>
              <input
                type="file"
                hidden
                onChange={(e) => setValue("testCase", e.target.files?.[0])}
              />
            </Button>

            <p className="text-neutral03 p2 truncate max-w-[400px]">
              {watch("testCase")?.name ?? "No file chosen"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <h4 className="m-0">Attachments</h4>
              <p className="p2 m-0">(optional)</p>
            </span>
            <Button variant="outlined" component="label" sx={{ height: 32 }}>
              <span>Add File</span>
              <input
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []);
                  const currentFiles = watch("attachment") || [];

                  setValue("attachment", [...currentFiles, ...newFiles], {
                    shouldValidate: true,
                  });
                }}
              />
            </Button>

            <p className="text-neutral03 p2 truncate max-w-[400px]">
              {attachments.length > 0
                ? attachments.map((f) => f.name).join(", ")
                : "No file chosen"}
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" variant="contained" disabled={!isValid}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
      <ConfirmNoTestCaseModal
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
        }}
        onConfirm={() => {
          if (pendingData) {
            handleCreate(pendingData);
          }
        }}
      />
    </Dialog>
  );
};

export default CreateAssignmentModal;
