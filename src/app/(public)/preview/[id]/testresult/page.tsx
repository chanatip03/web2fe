"use client";

import TestResult_full from "./result_full";
import TestResult_fe_be from "./result_fe_be";
import Cookies from "js-cookie";

export default function Page() {
  const project_type = Cookies.get("project_type");
  return project_type === "full" ? (
    <TestResult_full />
  ) : (
    <TestResult_fe_be />
  );
}
