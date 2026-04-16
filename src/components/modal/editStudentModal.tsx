"use client";

import { Dialog, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { userService } from "@/services/controller";
import type { AdminStudent } from "@/domain/admin";

interface Props {
  open: boolean;
  student: AdminStudent | null;
  onClose: () => void;
  onUpdated: (updated: AdminStudent) => void;
}

const Schema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().email("Invalid email format"),
  academy: z.string().min(1, "Please enter academy"),
  student_id: z.string().optional(),
});

type FormData = z.infer<typeof Schema>;

const EditStudentModal = ({ open, student, onClose, onUpdated }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    values: student
      ? {
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          academy: student.academy || "",
          student_id: student.studentId || "",
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (!student) return;

    try {
      await userService.updateStudent(student.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        academy: data.academy,
        student_id: data.student_id || undefined,
      });
      onUpdated({
        ...student,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        academy: data.academy,
        studentId: data.student_id || undefined,
      });
      handleClose();
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
            width: 600,
            borderRadius: "12px",
            maxWidth: "none",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
        <h3>Edit Student</h3>
        <IconButton onClick={handleClose}>
          <CloseIcon className="text-white" />
        </IconButton>
      </div>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 py-4 px-8"
        >
          <div className="grid grid-cols-2 gap-4">
            <RHFTextField name="first_name" control={control} label="First Name" fullWidth />
            <RHFTextField name="last_name" control={control} label="Last Name" fullWidth />
          </div>
          <RHFTextField name="student_id" control={control} label="Student ID" fullWidth />
          <RHFTextField name="email" control={control} label="Email" fullWidth />
          <RHFTextField name="academy" control={control} label="Academy" fullWidth />

          <div className="flex justify-end mt-4">
            <Button type="submit" variant="contained" disabled={!isValid}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
