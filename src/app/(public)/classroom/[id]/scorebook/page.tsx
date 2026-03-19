"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TeacherScorebookPage from "./teacherScorebook";
import StudentScorebookPage from "./studentScorebook";

export default function ScorebookLandingPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Read the role cookie on mount
    const userRole = Cookies.get("role");
    setRole(userRole || "student"); // Defaulting to student if none provided for testing
  }, []);

  if (role === null) {
    return null; // Or a loading spinner
  }

  return role === "teacher" ? <TeacherScorebookPage /> : <StudentScorebookPage />;
}
