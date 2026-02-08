import Syllabus from "./syllabus";

export const dynamic = "force-dynamic";

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

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const classroomId = params.id

  // 🔹 MOCK DATA
  const data: SyllabusResponseDTO = {
    classroom_name: "Software Engineering",
    teacher_name: "Prof. Suvit Khanthamano",
    classroom_description:
      "Software engineering principles. Process models and software evolution. System development cycle. System feasibility study. Planning of software development project. System analysis methodologies and tools. System design. System development. System implementation and evaluation. Case study. Hands-on experience on the system project in team and which will be completed in CSE 336.",
    learning_outcomes: [
      {
        id: "1",
        description:
          "Appreciate software engineering issues that form the background to developing complex and evolving software-intensive systems.",
      },
      {
        id: "2",
        description:
          "Plan and deliver effective software engineering projects, based on knowledge of widely used development lifecycle models.",
      },
      {
        id: "3",
        description:
          "Develop teamwork skills including general organization, planning and time management and inter-group negotiation.",
      },
      {
        id: "4",
        description:
          "Capture, document and analyse requirements.",
      },
      {
        id: "5",
        description:
          "Translate a requirements specification into an implementable design, following a structured and organised process.",
      },
      {
        id: "6",
        description:
          "Make effective use of UML, along with design strategies such as defining a software architecture, separation of concerns and design patterns.",
      },
    ],
  }

  return <Syllabus data={data} />
}
