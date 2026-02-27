"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs, Button, Chip, Switch, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateAssignmentModal from "@/components/modal/createAssignmentModal";
import UpdateAssignmentModal from "@/components/modal/updateAssignmentModal";
import { Assignment } from "@/domain/assignment";
import { useParams } from "next/navigation";
import { assignmentService } from "@/services/controller";
import Cookies from "js-cookie";

const checkOverdue = (date: string | Date) =>
  new Date(date).getTime() < Date.now();

async function onDelete(AssignmentId: number) {
  const response = await assignmentService.deleteAssignment(AssignmentId);

  if (response) {
    console.log("deletesuccess");
  }
}

const TeacherAssignmentListPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const params = useParams();
  const id = params.id;

  async function loadData() {
    try {
      const assignments = await assignmentService.getAssignments(Number(id));
      setAssignments(assignments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const handleToggle = async (assignmentId: number) => {
    try {
      const target = assignments.find((a) => a.id === assignmentId);
      if (!target) return;

      const newValue = !target.is_public;

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, is_public: newValue } : a,
        ),
      );

      await assignmentService.updateAssignment(
        {
          is_public: newValue,
          classroom_id: Number(id),
        },
        assignmentId,
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs separator="/">
          <Link href="/classroom">Home</Link>
          <span>{Cookies.get("classroomName")}</span>
          <span className="text-black font-medium">Assignment</span>
        </Breadcrumbs>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1>Assignment</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-12 mb-3 px-6 text-gray-600 text-sm font-semibold">
        <div className="col-span-5">Assignment Name</div>
        <div className="col-span-2 text-center">Publish Date</div>
        <div className="col-span-2 text-center">Due Date</div>
        <div className="col-span-2 text-center">Publish</div>
        <div className="col-span-1 text-center"></div>
      </div>

      <div className="flex flex-col gap-3">
        {assignments.map((item) => (
          <Link
            key={item.id}
            href={`/classroom/${id}/assignment/${item.id}`}
            className="grid grid-cols-12 items-center w-full shadow-sm border border-neutral02 rounded-lg px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary03"
          >
            {/* Name */}
            <div className="col-span-5 flex flex-col gap-2">
              <h5 className="font-semibold">{item.title}</h5>

              <div className="flex gap-2 flex-wrap">
                <Chip
                  label={item.is_group ? "Group" : "Individual"}
                  size="small"
                  sx={{
                    border: "1px solid var(--color-primary03)",
                    color: "var(--color-primary03)",
                    backgroundColor: "var(--color-primary01)",
                    borderRadius: 0.5,
                  }}
                />
                <Chip
                  label={item.project_type?.name}
                  size="small"
                  sx={{
                    border: "1px solid var(--color-primary03)",
                    color: "var(--color-primary03)",
                    backgroundColor: "var(--color-primary01)",
                    borderRadius: 0.5,
                  }}
                />
              </div>
            </div>

            {/* Publish */}
            <div className="col-span-2 text-center">
              <p className="p2 font-semibold">
                {new Date(item.start_date).toLocaleString("en-GB", {
                  timeZone: "Asia/Bangkok",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Due */}
            <div className="col-span-2 text-center">
              <p
                className={`p2 font-semibold ${
                  checkOverdue(item.due_date) ? "text-red-600" : ""
                }`}
              >
                {new Date(item.due_date).toLocaleString("en-GB", {
                  timeZone: "Asia/Bangkok",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Publish Toggle */}
            <div className="col-span-2 flex justify-center">
              <Switch
                checked={item.is_public}
                onChange={() => handleToggle(item.id)}
                sx={{ transform: "scale(1.2)" }}
              />
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-center gap-1">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setSelectedAssignment(item);
                  setOpenUpdate(true);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(item.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </Link>
        ))}
      </div>

      <CreateAssignmentModal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          loadData();
        }}
      />

      {selectedAssignment && (
        <UpdateAssignmentModal
          open={openUpdate}
          assignment={selectedAssignment}
          onClose={() => {
            setOpenUpdate(false);
            setSelectedAssignment(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default TeacherAssignmentListPage;
