"use client";

import { flattenError } from "zod/v4/core";
import SubmitPage, { Assignment } from "./submit";
export const dynamic = "force-dynamic";

/* ================= MOCK FETCH ================= */

function getMockAssignment(id: number): Assignment {
  return {
    id,
    name: "Final Project",
    detail:
      "In this project, you will create a simple web application that shows your daily life using English.\n• About Me\n• My Daily Routine",
    startDate: "2025-03-01T11:00:00",
    dueDate: "2025-04-09T11:01:00",
    isGroup: true,
    testcaseUrl: "",
    isPublic: true,
    projectTypeId: 2,
    projecrLanguage: "Fullstack",
    classroomId: 1,
    createdDate: "",
    updatedDate: "",
    deletedDate: null,
  };
}

/* ================= PAGE ================= */

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  const assignment = getMockAssignment(Number(params.id));

  return <SubmitPage assignment={assignment} />;
}
