"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import { useParams } from "next/navigation";
import { Classroom } from "@/domain/classroom";
import { classroomService } from "@/services/controller";
import { Breadcrumbs } from "@mui/material";

export default function Syllabus() {
  const [classrooms, setClassrooms] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function loadData() {
      try {
        const classrooms = await classroomService.getclassroomById(Number(id));
        setClassrooms(classrooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumbs>
        <Link href="/classroom">Home</Link>
        <span>{classrooms?.name}</span>
        <span className="text-black font-medium">Syllabus</span>
      </Breadcrumbs>

      {/* Title */}
      <h1 className="text-foreground font-bold my-6">Syllabus</h1>

      {/* Teacher */}
      <p className="text-neutral06 mb-4">
        <span className="font-semibold text-foreground">Teacher :</span>{" "}
        {classrooms?.teacher.user.first_name}{" "}
        {classrooms?.teacher.user.last_name}
      </p>

      <div>
        {/* Description */}
        <h2 className="text-foreground mb-3">Classroom Description</h2>
        {classrooms?.description && (
          <p className="text-neutral06 leading-relaxed wrap-break-word whitespace-pre-line mb-4">
            {classrooms?.description}
          </p>
        )}
      </div>

      {/* Learning Outcomes */}
      <h2 className="text-foreground mb-3">Learning Outcome</h2>
      {classrooms?.learningoutcomes ??
        classrooms?.learningoutcomes?.split("|").map((item, index) => (
          <div key={index} className="flex items-start gap-4 mb-2">
            <AssistantPhotoIcon
              className="text-primary03 mt-1 shrink-0"
              fontSize="small"
            />
            <p className="text-neutral06 break-all">{item}</p>
          </div>
        ))}
    </div>
  );
}
