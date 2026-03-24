"use client";

import StudentAssignmentListPage from "./studentassignmentlist";
import TeacherAssignmentListPage from "./teacherassignmentlist";
import { useAuth } from "@/app/authcontext";

export default function Page() {
  const { user } = useAuth();
  return user?.roles[0].name === "teacher" ? (
    <TeacherAssignmentListPage />
  ) : (
    <StudentAssignmentListPage />
  );
}
