"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TeacherRegisterForm from "./TeacherRegisterForm";
import StudentRegisterForm from "./studentRegisterForm";

function RegisterContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div>
      {role === "teacher" && <TeacherRegisterForm />}
      {role === "student" && <StudentRegisterForm />}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
