"use client";

import StudentAssignmentListPage from "./studentassignmentlist";
import TeacherAssignmentListPage from "./teacherassignmentlist";
import Cookies from "js-cookie";

export default function Page() {
  const role = Cookies.get("role");
  return role === "teacher" ? (
    <TeacherAssignmentListPage />
  ) : (
    <StudentAssignmentListPage />
  );
}
