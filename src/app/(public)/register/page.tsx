"use client";

import { useSearchParams } from "next/navigation";
import TeacherRegisterForm from "./TeacherRegisterForm";
import StudentRegisterForm from "./studentRegisterForm";

export default function Page() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div>
      {role === "teacher" && <TeacherRegisterForm />}
      {role === "student" && <StudentRegisterForm />}
    </div>
  );
}
