"use client";

import StudentProfile from "./studentProfile";
import TeacherProfile from "./teacherProfile";
import { useAuth } from "@/app/authcontext";

export default function Page() {
  const { user } = useAuth();
  return user?.roles.name === "teacher" ? (
    <TeacherProfile />
  ) : (
    <StudentProfile />
  );
}
