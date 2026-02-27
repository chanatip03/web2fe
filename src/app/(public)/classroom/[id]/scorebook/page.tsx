"use client";

import Link from "next/link";
import { Breadcrumbs, Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ScorebookTable from "./scorebookTable";

export const mockData = {
  assignments: [
    { id: 1, title: "Assignment Flex Box 1" },
    { id: 2, title: "Assignment Flex Box 2" },
    { id: 3, title: "Assignment Flex Box 3" },
    { id: 4, title: "Assignment Flex Box 4" },
    { id: 5, title: "Assignment Flex Box 5" },
  ],

  classroom: {
    id: 1,
    name: "Web Programming II",
    description: "This is a web programming class.",
    semester: "2024-1",
    code: "XCYGI22",
    excelLink: "https://example.com/excel",
    learningOutcome: "Learn how to build web applications.",
  },

  student: [
    {
      id: 1,
      studentId: "66090500401",
      user: {
        id: 1,
        firstName: "Benjamin",
        lastName: "Deemak",
        email: "Benjamin.Deem@gmail.com",
        imageUrl: "https://i.pravatar.cc/100?img=1",
      },
      project: [
        { assignmentId: 1, score: 8 },
        { assignmentId: 2, score: 9 },
        { assignmentId: 3, score: 10 },
        { assignmentId: 4, score: 10 },
        { assignmentId: 5, score: 9 },
      ],
    },
    {
      id: 2,
      studentId: "66090500402",
      user: {
        id: 2,
        firstName: "Jennie",
        lastName: "Ree",
        email: "Jennie.Ree@gmail.com",
        imageUrl: "https://i.pravatar.cc/100?img=2",
      },
      project: [
        { assignmentId: 1, score: 7 },
        { assignmentId: 2, score: 8 },
        { assignmentId: 3, score: 9 },
        { assignmentId: 4, score: 8 },
        { assignmentId: 5, score: 10 },
      ],
    },
    {
      id: 3,
      studentId: "66090500403",
      user: {
        id: 3,
        firstName: "Somchai",
        lastName: "Jaidee",
        email: "Somchai.Jaid@gmail.com",
        imageUrl: "https://i.pravatar.cc/100?img=3",
      },
      project: [
        { assignmentId: 1, score: 6 },
        { assignmentId: 2, score: 7 },
        { assignmentId: 3, score: 8 },
        { assignmentId: 4, score: 9 },
        { assignmentId: 5, score: 8 },
      ],
    },
    {
      id: 4,
      studentId: "66090500404",
      user: {
        id: 4,
        firstName: "Micha",
        lastName: "Thomson",
        email: "Micha.Thom@gmail.com",
        imageUrl: "https://i.pravatar.cc/100?img=4",
      },
      project: [
        { assignmentId: 1, score: 10 },
        { assignmentId: 2, score: 9 },
        { assignmentId: 3, score: 10 },
        { assignmentId: 4, score: 9 },
        { assignmentId: 5, score: 10 },
      ],
    },
    {
      id: 5,
      studentId: "66090500405",
      user: {
        id: 5,
        firstName: "Tula",
        lastName: "Patanaboonmee",
        email: "Tula.pata@gmail.com",
        imageUrl: "https://i.pravatar.cc/100?img=5",
      },
      project: [
        { assignmentId: 1, score: 5 },
        { assignmentId: 2, score: 6 },
        { assignmentId: 3, score: 7 },
        { assignmentId: 4, score: 8 },
        { assignmentId: 5, score: 7 },
      ],
    },
  ],
};

export default function ScorebookLandingPage() {
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2 mb-6">
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          <Link href="/classroom/listclassroom">Home</Link>
          <span>{mockData.classroom.name}</span>
          <span className="text-black">Scorebook</span>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between mb-8">
        <h1 className="-mb-2">Scorebook</h1>

        <Button variant="contained" startIcon={<FileUploadIcon />}>
          Export (.csv)
        </Button>
      </div>

      <ScorebookTable data={mockData} />
    </div>
  );
}
