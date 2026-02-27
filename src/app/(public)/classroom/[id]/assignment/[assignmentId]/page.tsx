"use client";

import Cookies from "js-cookie";
import TeacherAssignmentInfoPage from "./teacher.assignmentInfo.page";
import StudentAssignmentInfoPage from "./student.assignment.info.page";

export default function Page() {
  const role = Cookies.get("role");
  return role === "teacher" ? (
    <TeacherAssignmentInfoPage />
  ) : (
    <StudentAssignmentInfoPage />
  );
}
