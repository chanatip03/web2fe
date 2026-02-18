"use client";

import { Button, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentDiscordTip from "./StudentDiscordTip";
import Navbar from "@/components/navbar";
import { Classroom, CreateClassRoomRequest } from "@/domain/classroom";
import { authService, classroomService } from "@/services/controller";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateClassroomModal from "@/components/modal/createClassroomModal";
import Cookies from "js-cookie";

export default function ListClassroom() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const me = await authService.me();
        const classrooms = await classroomService.getclassrooms();

        const uniqueSemesters = [
          "all",
          ...Array.from(new Set(classrooms.map((c) => c.semester))),
        ];
        Cookies.set("role", me.role, { expires: 7 });
        setClassrooms(classrooms);
        setSemesterOptions(uniqueSemesters);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  //tesmp loading
  if (loading) return <div>Loading...</div>;

  const onSubmitCreateClassroom = async (data: CreateClassRoomRequest) => {
    try {
      const res = await classroomService.createClassroom(data);
      if (!res) {
        throw new Error("Failed to create classroom");
      }
      setOpenCreate(false);

      router.refresh();
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  const filteredClassrooms =
    selectedSemester === "all"
      ? classrooms
      : classrooms.filter((c) => c.semester === selectedSemester);

  const role = Cookies.get("role");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral01 px-20 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-212121">All Classroom</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {role === "student" ? (
              <Button variant="contained" startIcon={<AddIcon />}>
                Join Classroom
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreate(true)}
              >
                Create Classroom
              </Button>
            )}

            <div className="flex items-center gap-3">
              <Select
                size="small"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                sx={{
                  width: 140,
                  height: 46,
                }}
                IconComponent={ExpandMoreIcon}
              >
                {semesterOptions.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    {sem === "all" ? "All" : sem}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* CLASSROOM GRID */}
        <div className="flex justify-center">
          <div className="w-full flex flex-wrap gap-10">
            {filteredClassrooms.map((classroom) => (
              <Button
                key={classroom.id}
                onClick={() => {
                  Cookies.set("classroomName", String(classroom.name), {
                    expires: 7,
                  });
                  router.push(`/classroom/${classroom.id}/syllabus`);
                }}
                sx={{
                  width: "287px",
                  height: "214px",
                  textTransform: "none",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition duration-200 p-6 overflow-hidden">
                  <div className="bg-secondary03 text-white p-8 w-[260px] h-[152px] rounded-2xl flex items-start">
                    <h1 className="text-2xl font-extrabold wrap-break-word leading-snug line-clamp-2">
                      {classroom.name}
                    </h1>
                  </div>

                  <p className="mt-6 text-base text-gray-500">
                    Semester{" "}
                    <span className="font-semibold text-black text-lg">
                      {classroom.semester}
                    </span>
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {openCreate && (
          <CreateClassroomModal
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSubmit={onSubmitCreateClassroom}
          />
        )}
        {role === "student" && <StudentDiscordTip />}
      </div>
    </>
  );
}
