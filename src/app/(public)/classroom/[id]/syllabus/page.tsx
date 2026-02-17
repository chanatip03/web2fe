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
    <div className="px-20 py-10 bg-neutral01">
      {/* Breadcrumb */}
      <Breadcrumbs className="text-sm mb-6">
        <Link href="/classroom">Home</Link>
        <span>{classrooms?.name}</span>
        <span className="text-black font-medium">Syllabus</span>
      </Breadcrumbs>

      {/* Title */}
      <h1 className="mb-6 text-foreground font-bold">Syllabus</h1>

      {/* Teacher */}
      <p className="mb-8 text-neutral06">
        <span className="font-semibold text-foreground">Teacher :</span>{" "}
        {classrooms?.teacher.user.first_name}{" "}
        {classrooms?.teacher.user.last_name}
      </p>

      {/* Description */}
      {classrooms?.description && (
        <div>
          <h2 className="mb-3 text-foreground">Classroom Description</h2>
          <p className="text-neutral06 leading-relaxed mb-10">
            {classrooms?.description}
          </p>
        </div>
      )}

      {/* Learning Outcomes */}
      <h2 className="mb-4 text-foreground">Learning Outcome</h2>
      <ul className="space-y-5">
        {classrooms?.learningoutcomes?.split(",").map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <AssistantPhotoIcon
              className="text-primary03 mt-1 shrink-0"
              fontSize="small"
            />
            <p className="text-neutral06 leading-relaxed">{item.trim()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
