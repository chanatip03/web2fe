"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import Cookies from "js-cookie";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Classroom, UpdateClassRoomRequest } from "@/domain/classroom";
import { classroomService } from "@/services/controller";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useAuth } from "@/app/authcontext";

const Schema = z.object({
  name: z.string().min(1, "Please enter a classroom name"),
  semester: z
    .string()
    .trim()
    .regex(/^[12s]\/(2\d{3})$/, "Format must be like 2/2566 or 2/2025"),
  description: z.string().optional(),
  learningoutcomes: z
    .array(
      z.object({
        value: z.string().min(1),
      }),
    )
    .optional(),
});

type FormData = z.infer<typeof Schema>;

export default function Syllabus() {
  const [classrooms, setClassrooms] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { user } = useAuth();

  const { control, handleSubmit, reset, formState: { isDirty }, } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      semester: "",
      description: "",
      learningoutcomes: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "learningoutcomes",
  });

  const mapClassroomToForm = (data: Classroom): FormData => ({
    name: data.name || "",
    semester: data.semester || "",
    description: data.description || "",
    learningoutcomes: data.learningoutcomes
      ? data.learningoutcomes.split("|").map((item) => ({
        value: item,
      }))
      : [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const classrooms = await classroomService.getclassroomById(Number(id));
        setClassrooms(classrooms);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load classroom data.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const onSubmitUpdateClassroom = async (data: FormData) => {
    try {
      const payload: UpdateClassRoomRequest = {
        name: data.name,
        semester: data.semester,
        description: data.description,
        learningoutcomes:
          data.learningoutcomes
            ?.map((item) => item.value.trim())
            .filter(Boolean)
            .join("|") || "",
      };

      const res = await classroomService.updateClassroom(payload, Number(id));
      if (!res) throw new Error("Failed to update classroom");

      Cookies.set("classroomName", String(payload.name));

      const updatedClassroom = {
        ...classrooms,
        ...payload,
      } as Classroom;

      setClassrooms(updatedClassroom);
      reset(mapClassroomToForm(updatedClassroom));//เพื่ออัปเดตทันทีหลังจากบันทึก
      setIsEdit(false);

      setSnackbar({
        open: true,
        message: "Classroom updated successfully.",
        severity: "success",
      });


      router.refresh();
    } catch (error) {
      console.error("Error updating classroom:", error);

      setSnackbar({
        open: true,
        message: "Failed to update classroom. Please try again later.",
        severity: "error",
      });

    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Breadcrumbs>
        <Link href="/classroom">Home</Link>
        <span>{classrooms?.name}</span>
        <span className="text-black font-medium">
          {isEdit ? "Edit Classroom" : "Syllabus"}
        </span>
      </Breadcrumbs>

      {!isEdit ? (
        <>
          <div className="flex items-center justify-between my-6">
            <h1>Syllabus</h1>
            {user?.roles.name === "teacher" && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  if (classrooms) {
                    reset(mapClassroomToForm(classrooms));
                  }
                  setIsEdit(true);
                }}
              >
                Edit Classroom
              </Button>
            )}
          </div>

          <p className="text-neutral06 mb-4">
            <span className="font-semibold text-foreground">Teacher :</span>{" "}
            {classrooms?.teacher?.user?.first_name}{" "}
            {classrooms?.teacher?.user?.last_name}
          </p>

          <div>
            <h2 className="text-foreground mb-3">Classroom Description</h2>
            {classrooms?.description && (
              <p className="text-neutral06 leading-relaxed break-words whitespace-pre-line mb-4">
                {classrooms.description}
              </p>
            )}
          </div>

          <h2 className="text-foreground mb-3">Learning Outcome</h2>
          {classrooms?.learningoutcomes
            ?.split("|")
            .filter((item) => item.trim() !== "")
            .map((item, index) => (
              <div key={index} className="flex items-start gap-4 mb-2">
                <AssistantPhotoIcon
                  className="text-primary03 mt-1 shrink-0"
                  fontSize="small"
                />
                <p className="text-neutral06 break-all">{item}</p>
              </div>
            ))}
        </>
      ) : (
        <>
          <h1 className="my-6">Edit Classroom</h1>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmitUpdateClassroom)}
          >
            <div className="flex gap-4">
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="name"
                  fullWidth
                  label="Classroom Name"
                />
              </div>

              <div className="flex-1">
                <RHFTextField
                  control={control}
                  name="semester"
                  fullWidth
                  label="Semester"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4">Class Description</h2>
              <RHFTextField
                control={control}
                name="description"
                multiline
                rows={5}
                fullWidth
                label="Classroom Description"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="mb-2">Learning Outcome</h2>
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => append({ value: "" })}
                >
                  Add Learning Outcome
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3">
                    <div className="flex-1">
                      <RHFTextField
                        control={control}
                        name={`learningoutcomes.${index}.value`}
                        fullWidth
                        multiline
                        label={`Learning Outcome ${index + 1}`}
                      />
                    </div>

                    <IconButton
                      color="error"
                      onClick={() => remove(index)}
                      className="mt-2"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  if (!classrooms) return;
                  reset(mapClassroomToForm(classrooms));
                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty}>
                Save
              </Button>
            </div>
          </form>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="standard"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
