"use client"

import Link from "next/link"
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto"

interface LearningOutcomeDTO {
  id: string
  description: string
}

interface SyllabusResponseDTO {
  classroom_name: string
  teacher_name: string
  classroom_description?: string
  learning_outcomes: LearningOutcomeDTO[]
}

export default function Syllabus({ data }: { data: SyllabusResponseDTO }) {
  return (
    <>
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
          <span className="text-neutral04">{data.classroom_name}</span>
          <span className="mx-2 text-neutral04">/</span>
          <span className="font-semibold text-foreground">Syllabus</span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-foreground font-bold">Syllabus</h1>

        {/* Teacher */}
        <p className="mb-8 text-neutral06">
          <span className="font-semibold text-foreground">Teacher :</span>{" "}
          {data.teacher_name}
        </p>

        {/* Description */}
        {data.classroom_description && (
          <>
            <h2 className="mb-3 text-foreground">Classroom Description</h2>
            <p className="text-neutral06 leading-relaxed mb-10">
              {data.classroom_description}
            </p>
          </>
        )}

        {/* Learning Outcomes */}
        <h2 className="mb-4 text-foreground">Learning Outcome</h2>
          <ul className="space-y-5">
            {data.learning_outcomes.map((item) => (
              <li key={item.id} className="flex items-start gap-4">
                <AssistantPhotoIcon
                  className="text-primary03 mt-1 shrink-0"
                  fontSize="small"
                />
                <p className="text-neutral06 leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ul>
      </div>
    </>
  )
}
