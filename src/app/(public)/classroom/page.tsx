"use client";

import { Button, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentDiscordTip from "./StudentDiscordTip";
import Navbar from "@/components/navbar";
import { Classroom, CreateClassRoomRequest } from "@/domain/classroom";
import { classroomService } from "@/services/controller";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateClassroomModal from "@/components/modal/createClassroomModal";
import JoinClassroomModal from "@/components/modal/joinClassroommodal";
import { useAuth } from "@/app/authcontext";
import Cookies from "js-cookie";

export default function ListClassroom() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openJoin, setOpenJoin] = useState<boolean>(false);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  async function loadData() {
    try {
      const classrooms = await classroomService.getclassrooms();

      let uniqueSemesters = ["all"];

      if (Array.isArray(classrooms)) {
        uniqueSemesters = [
          "all",
          ...Array.from(new Set(classrooms.map((c) => c.semester))),
        ];
      }
      setClassrooms(Array.isArray(classrooms) ? classrooms : []);
      setSemesterOptions(uniqueSemesters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral01 px-20 py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-212121">All Classroom</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {user?.roles.name === "student" ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenJoin(true)}
              >
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
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  textAlign: "left",

                  backgroundColor: "white",
                  borderRadius: "24px",
                  boxShadow: 3,
                  p: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.2s",

                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "white",
                  },
                }}
              >
                <div className="bg-secondary03 text-white p-8 w-full h-[172px] rounded-t-2xl flex items-start overflow-hidden">
                  <h1 className="text-2xl font-extrabold wrap-break-word leading-snug line-clamp-2">
                    {classroom.name}
                  </h1>
                </div>

                <p className="mt-2 text-base text-gray-500">
                  Semester{" "}
                  <span className="font-semibold text-black text-lg">
                    {classroom.semester}
                  </span>
                </p>
              </Button>
            ))}
          </div>
        </div>

        {openCreate && (
          <CreateClassroomModal
            open={openCreate}
            onClose={() => {
              loadData();
              setOpenCreate(false);
            }}
            onSubmit={onSubmitCreateClassroom}
          />
        )}
        {openJoin && (
          <JoinClassroomModal
            open={openJoin}
            onClose={() => {
              loadData();
              setOpenJoin(false);
            }}
          />
        )}
        {user?.roles.name === "student" && <StudentDiscordTip />}
      </div>
    </>
  );
}
