"use client";

import StudentAssignmentListPage from "./studentassignmentlist";
import TeacherAssignmentListPage from "./teacherassignmentlist";
import { useAuth } from "@/app/authcontext";

export default function Page() {
  const { user } = useAuth();
  return user?.roles.name === "teacher" ? (
    <TeacherAssignmentListPage />
  ) : (
    <StudentAssignmentListPage />
  );
}
