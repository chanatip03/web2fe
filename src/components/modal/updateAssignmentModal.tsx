"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "../form/RHFTextField";
import { RHFSelect } from "../form/RHFSelect";
import { RHFDateTimePickerDayjs } from "../form/RHFDateTimePicker";
import {
  ProjectType,
  Language,
  Assignment,
  Attachments,
} from "@/domain/assignment";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { assignmentService } from "@/services/controller";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const mockProjectTypes: ProjectType[] = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "Fullstack" },
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
  publishDate: z.string().refine((val) => dayjs(val).isValid(), {
    message: "Invalid date format",
  }),
  dueDate: z.string().refine((val) => dayjs(val).isValid(), {
    message: "Invalid date format",
  }),
  attachment: z.array(z.instanceof(File)).optional(),
});

// TODO sync if project type id == 3 language shoude null

type FormData = z.infer<typeof Schema>;

const UpdateAssignmentModal = ({ open, onClose, assignment, onSuccess, onError }: Props) => {
  const [existingAttachments, setExistingAttachments] = useState<Attachments[]>(
    [],
  );
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
    [],
  );

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
      publishDate: "",
      dueDate: "",
      attachment: [],
    },
  });

  const projectTypeId = watch("projectTypeId");
  const attachments = watch("attachment") ?? [];
  const enableLanguage = projectTypeId === 1 || projectTypeId === 2;

  useEffect(() => {
    if (!assignment) return;

    reset({
      name: assignment.title,
      detail: assignment.description ?? "",
      assignmentType: assignment.is_group ? "group" : "individual",
      projectTypeId: assignment.project_type?.id,
      languageId: assignment.language?.id,
      publishDate: dayjs(assignment.start_date).toISOString(),
      dueDate: dayjs(assignment.due_date).toISOString(),
      attachment: [],
    });

    setExistingAttachments(assignment.attachments || []);
    setDeletedAttachmentIds([]);
  }, [assignment, reset]);

  const handleRemoveExisting = (id: number) => {
    setExistingAttachments((prev) => prev.filter((a) => a.id !== id));
    setDeletedAttachmentIds((prev) => [...prev, id]);
  };

  const onSubmit = async (data: FormData) => {
    if (!assignment) return;

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
        delete_attachment_ids: deletedAttachmentIds,
      };

      if (data.projectTypeId === 3) {
        delete data.languageId;
      }

      await assignmentService.updateAssignment(
        payload,
        assignment.id,
        undefined,
        data.attachment ?? [],
      );

      handleClose();
      onSuccess?.("Assignment updated successfully.");
    } catch (err) {
      console.error(err);
      onError?.("Failed to update assignment. Please try again later.");
    }
  };

  const handleClose = () => {
    reset();
    setExistingAttachments([]);
    setDeletedAttachmentIds([]);
    onClose();
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
          },
        },
      }}
    >
      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>Update Assignment</h3>

        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4 px-8"
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

          <div className="grid grid-cols-3 gap-4">
            <RHFSelect name="assignmentType" control={control} label="Type">
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="group">Group</MenuItem>
            </RHFSelect>

            <RHFSelect name="projectTypeId" control={control} label="Project">
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

          <div className="grid grid-cols-2 gap-4">
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

          <Box>
            <h4>Existing Files</h4>
            {existingAttachments.length === 0 && <p>No files</p>}
            {existingAttachments.map((file) => (
              <div key={file.id} className="flex justify-between items-center">
                <span>{file.file_url.split("/").pop()}</span>
                <Button
                  color="error"
                  onClick={() => handleRemoveExisting(file.id)}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </Box>

          <div className="flex items-center gap-3">
            <Button variant="outlined" component="label">
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

            <p className="truncate max-w-[400px]">
              {attachments.length > 0
                ? attachments.map((f) => f.name).join(", ")
                : "No new file"}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="contained" disabled={!isValid}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAssignmentModal;
