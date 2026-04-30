"use client";

import TeacherScorebookPage from "./teacherScorebook";
import StudentScorebookPage from "./studentScorebook";
import { useAuth } from "@/app/authcontext";

export default function Page() {
  const { user } = useAuth();
  return user?.roles.name === "teacher" ? (
    <TeacherScorebookPage />
  ) : (
    <StudentScorebookPage />
  );
}
