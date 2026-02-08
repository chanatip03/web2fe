"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { RHFTextField } from "@/components/form/RHFTextField";
import Link from "next/link"

interface Props {
  apiBase: string;
}

type LearningOutcomeForm = {
  description: string;
};

type FormData = {
  name: string;
  description: string;
  learning_outcomes: LearningOutcomeForm[];
};

export default function ClassroomSetting({ apiBase }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "SOFTWARE ENGINEERING I",
      description:
        "Software engineering principles. Ethics for software engineering. Process models and software evolution...",
      learning_outcomes: [
        { description: "Appreciate the software engineering issues..." },
        { description: "Plan and deliver an effective software engineering process..." },
        { description: "Employ group working skills including organization..." },
        { description: "Capture, document and analyse requirements." },
        { description: "Translate requirements specification into an implementable design..." },
        { description: "Make effective use of UML, along with design strategies..." },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "learning_outcomes",
  });

  const onSubmit = (data: FormData) => {
    console.log("UPDATE CLASSROOM PAYLOAD:", data);
  };

  return (
    <div className="max-w-[1500px] px-25 py-8 bg-neutral01">
        {/* Breadcrumb */}
        <div className="text-sm mb-6">
          <Link
            href="/classroom/listclassroom"
            className="text-neutral04 hover:text-primary03 transition"
          >
            Home
          </Link>
          <span className="mx-2 text-neutral04">/</span>
          <span className="text-neutral04">{control._formValues.name}</span>
          <span className="mx-2 text-neutral04">/</span>
          <span className="font-semibold text-foreground">Setting</span>
        </div>
      <h1 className="mb-8">Classroom Setting</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">

        {/* Classroom Name */}
        <div>
          <h4 className="mb-2">Classroom Name</h4>
          <RHFTextField
            control={control}
            name="name"
            fullWidth
            label={`Classroom Name`}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/* Description */}
        <div>
          <h4 className="mb-2 ">Class Description</h4>
          <RHFTextField
            control={control}
            name="description"
            multiline
            rows={5}
            fullWidth
            label={`Classroom Description`}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        {/* Learning Outcomes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4>Learning Outcome</h4>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => append({ description: "" })}
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
                    name={`learning_outcomes.${index}.description`}
                    fullWidth
                    multiline
                    rows={2}
                    label={`Learning Outcome ${index + 1}`}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <IconButton
                  color="error"
                  onClick={() => remove(index)}
                  className="mt-2"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outlined" color="error">
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
