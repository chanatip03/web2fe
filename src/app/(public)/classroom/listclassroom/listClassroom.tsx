"use client";

import { useForm } from "react-hook-form";
import { Button, MenuItem, Select } from "@mui/material";
import { RHFSelect } from "@/components/form/RHFSelect";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentDiscordTip from "./StudentDiscordTip";


interface Classroom {
  id: string;
  name: string;
  semester: string;
  year: number;
}

interface ListClassroomProps {
  apiBase: string;
  role: "student" | "teacher";
}

type FilterForm = {
  semester: string;
};

export default function ListClassroom({ apiBase, role }: ListClassroomProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  const { control, watch } = useForm<FilterForm>({
    defaultValues: {
      semester: "all",
    },
  });

  const semesterFilter = watch("semester");

  // MOCK DATA ไปก่อน
  useEffect(() => {
    const mock: Classroom[] = [
      { id: "1", name: "WEB PROGRAMMING 2", semester: "2", year: 2025 },
      { id: "2", name: "WEB PROGRAMMING 1", semester: "1", year: 2025 },
      
    ];
    setClassrooms(mock);
  }, []);

  const filteredClassrooms =
    semesterFilter === "all"
      ? classrooms
      : classrooms.filter((c) => c.semester === semesterFilter);

  return (
    <div className="min-h-screen bg-neutral01 px-10 py-8 max-w-[1700px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <h1 className="text-212121">All Classroom</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {role === "student" ? (
                        <Button variant="contained">+ Join Classroom</Button>
                    ) : (
                        <Button variant="contained">+ Create Classroom</Button>
                    )}

                    <div className="w-[185px]">
                        <RHFSelect<FilterForm>
                        name="semester"
                        control={control}
                        size="small"
                        >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="1">Semester 1</MenuItem>
                        <MenuItem value="2">Semester 2</MenuItem>
                        </RHFSelect>
                    </div>
                </div>
        </div>

        {/* CLASSROOM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 max-w-[1000px]">
          {filteredClassrooms.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition-all duration-200 cursor-pointer p-3"
            >
              {/* TOP BLUE SECTION (อยู่ "ใน" การ์ดขาว) */}
              <div className="bg-secondary03 text-white px-8 py-10 min-h-[150px] flex items-start rounded-t-3xl">
                <h3 className="text-[26px] font-extrabold leading-snug tracking-wide">
                  {cls.name}
                </h3>
              </div>

              {/* BOTTOM INFO */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-neutral04 text-base">
                  Semester{" "}
                  <span className="text-foreground font-semibold">
                    {cls.semester}/{cls.year}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      <StudentDiscordTip role={role} />
    </div>
  );
}
