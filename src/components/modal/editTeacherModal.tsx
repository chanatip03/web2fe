"use client";

import { Dialog, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { userService } from "@/services/controller";
import type { AdminTeacher } from "@/domain/admin";

interface Props {
  open: boolean;
  teacher: AdminTeacher | null;
  onClose: () => void;
  onUpdated: (updated: AdminTeacher) => void;
}

const Schema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().email("Invalid email format"),
  academy: z.string().min(1, "Please enter academy"),
});

type FormData = z.infer<typeof Schema>;

const EditTeacherModal = ({ open, teacher, onClose, onUpdated }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    values: teacher
      ? {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          email: teacher.email,
          academy: teacher.academy || "",
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (!teacher) return;

    try {
      await userService.updateTeacher(teacher.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        academy: data.academy,
      });
      onUpdated({
        ...teacher,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        academy: data.academy,
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
        <h3>Edit Teacher</h3>
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

export default EditTeacherModal;
