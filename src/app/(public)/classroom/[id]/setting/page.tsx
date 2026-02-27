"use client";

import { useEffect, useState } from "react";
import { Button, IconButton, Breadcrumbs } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { RHFTextField } from "@/components/form/RHFTextField";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Classroom, UpdateClassRoomRequest } from "@/domain/classroom";
import { classroomService } from "@/services/controller";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

export default function ClassroomSetting() {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const params = useParams();
  const id = params.id ? Number(params.id) : 0;

  const { control, handleSubmit, reset } = useForm<FormData>({
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
    name: data.name,
    semester: data.semester,
    description: data.description,
    learningoutcomes: data.learningoutcomes
      ? data.learningoutcomes.split("|").map((item) => ({
          value: item,
        }))
      : [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const classroom = await classroomService.getclassroomById(Number(id));

        setClassroom(classroom);

        reset(mapClassroomToForm(classroom));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadData();
  }, [id, reset]);

  if (loading) return <div>Loading...</div>;

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

      const res = await classroomService.updateClassroom(payload, id);

      if (!res) throw new Error("Failed to update classroom");

      router.refresh();
    } catch (error) {
      console.error("Error updating classroom:", error);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumbs>
        <Link href="/classroom">Home</Link>
        <span>{classroom?.name}</span>
        <span className="text-black font-medium">Syllabus</span>
      </Breadcrumbs>
      <h1 className="mb-8">Classroom Setting</h1>

      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmitUpdateClassroom)}
      >
        {/* Classroom Name */}
        <div>
          <h2 className="mb-4">Classroom Name</h2>
          <RHFTextField
            control={control}
            name="name"
            fullWidth
            label={`Classroom Name`}
          />
          <RHFTextField
            control={control}
            name="semester"
            fullWidth
            label={`Semester`}
          />
        </div>

        {/* Description */}
        <div>
          <h2 className="mb-4">Class Description</h2>
          <RHFTextField
            control={control}
            name="description"
            multiline
            rows={5}
            fullWidth
            label={`Classroom Description`}
          />
        </div>

        {/* Learning Outcomes */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="mb-2">Learning Outcome</h2>
            <Button
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

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (!classroom) return;
              reset(mapClassroomToForm(classroom));
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
