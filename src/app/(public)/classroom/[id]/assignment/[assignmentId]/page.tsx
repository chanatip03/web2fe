"use client";

import TeacherAssignmentInfoPage from "./teacher.assignmentInfo.page";
import StudentAssignmentInfoPage from "./student.assignment.info.page";
import { useAuth } from "@/app/authcontext";

export default function Page() {
  const { user } = useAuth();
  return user?.roles.name === "teacher" ? (
    <TeacherAssignmentInfoPage />
  ) : (
    <StudentAssignmentInfoPage />
  );
}
