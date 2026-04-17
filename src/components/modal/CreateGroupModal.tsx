"use client";

import { useForm } from "react-hook-form";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useState, useEffect } from "react";
import { groupService, userService, authService } from "@/services/controller";
import { Group } from "@/domain/group";
import { IStudent } from "@/domain/student";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (group: Group) => void;
  assignmentId: number;
  classroomId: number;
  initialGroup?: Group | null;
}

interface FormValues {
  groupName: string;
}

export default function CreateGroupModal({ open, onClose, onSave, assignmentId, classroomId, initialGroup }: Props) {
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      groupName: "",
    },
    mode: "onSubmit",
  });

  const [members, setMembers] = useState<IStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<IStudent[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      if (initialGroup) {
        setValue("groupName", initialGroup.name);
        setMembers(initialGroup.members.map((m) => m.student));
      } else {
        setValue("groupName", "");
        setMembers([]);
      }

      const fetchData = async () => {
        try {
          const [authData, currentUserData, students] = await Promise.all([
            authService.me(),
            userService.getCurrentUser(),
            groupService.getAvailableMembers(assignmentId, classroomId),
          ]);

          setAvailableStudents(students);

          let myId: number | null = null;
          let currentStudent: IStudent | null = null;

          if ("student_id" in currentUserData) {
            currentStudent = currentUserData;
            myId = currentStudent.id;
          } else {
            const foundStudent = students.find((s) => s.user.id === authData.user.id);
            if (foundStudent) {
              currentStudent = foundStudent;
              myId = foundStudent.id;
            }
          }

          if (myId) {
            setCurrentStudentId(myId);
          }

          if (!initialGroup && currentStudent) {
            setMembers([currentStudent]);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchData();
    } else {
      reset();
      setMembers([]);
      setSearch("");
      setCurrentStudentId(null);
    }
  }, [open, assignmentId, initialGroup, setValue, reset]);

  const toggleMember = (s: IStudent) => {
    if (members.find((m) => m.id === s.id))
      setMembers(members.filter((m) => m.id !== s.id));
    else setMembers([...members, s]);
  };

  const handleSave = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let savedGroup: Group;
      if (initialGroup) {
        const initialMemberIds = initialGroup.members.map((m) => m.student.id);
        const currentMemberIds = members.map((m) => m.id);

        const new_member_ids = currentMemberIds.filter((id) => !initialMemberIds.includes(id));
        const remove_member_ids = initialMemberIds.filter((id) => !currentMemberIds.includes(id));

        savedGroup = await groupService.updateGroup(initialGroup.id, {
          name: data.groupName,
          new_member_ids,
          remove_member_ids,
        });
      } else {
        const member_ids = members.map((m) => m.id);
        savedGroup = await groupService.createGroup({
          name: data.groupName,
          assignment_id: assignmentId,
          member_ids,
        });
      }
      onSave(savedGroup);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save group");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const filteredStudents = availableStudents.filter((s) =>
    s.id !== currentStudentId &&
    `${s.user.first_name} ${s.user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-w-[95vw] rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-primary03 text-white px-6 py-4 flex justify-between items-center">
          <h4 className="font-bold">Manage Group</h4>
          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          <RHFTextField<FormValues>
            name="groupName"
            control={control}
            label="Group Name"
            placeholder="Enter group name"
            rules={{
              required: "Please enter group name",
              minLength: {
                value: 3,
                message: "Group name must be at least 3 characters",
              },
            }}
          />
          <p className="font-semibold text-neutral04 mb-1">Group Member</p>
          <div className="grid grid-cols-2 gap-5">
            {/* LEFT MEMBERS */}
            <div className="border border-neutral03 rounded-lg p-4 h-[260px] flex flex-col">
              <div className="flex flex-wrap gap-2 overflow-y-auto">
                {members.length === 0 && (
                  <p className="text-neutral04 text-sm">No members selected</p>
                )}

                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 bg-white border border-neutral03 shadow-sm rounded-lg px-2 py-1"
                  >
                    <img
                      src={m.user.imageUrl}
                      className="w-6 h-6 rounded-full"
                    />

                    <span className="text-sm whitespace-nowrap">
                      {m.user.first_name} {m.user.last_name}
                    </span>

                    <button
                      onClick={() => toggleMember(m)}
                      disabled={m.id === currentStudentId}
                      className={`ml-1 ${
                        m.id === currentStudentId
                          ? "text-neutral03 cursor-not-allowed"
                          : "text-neutral05 hover:text-red-500"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT LIST */}
            <div className="border border-neutral03 rounded-lg p-4 h-[260px] flex flex-col">
              {/* SEARCH */}
              <input
                placeholder="Search name member"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-neutral03 rounded-lg px-3 py-2 mb-3 text-sm outline-none"
              />

              {/* LIST */}
              <div className="overflow-y-auto flex-1 divide-y divide-neutral03">
                {filteredStudents.map((s) => {
                  const selected = members.some((m) => m.id === s.id);

                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleMember(s)}
                      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-neutral02 ${
                        selected ? "bg-neutral02" : ""
                      }`}
                    >
                      <img
                        src={s.user.imageUrl}
                        className="w-8 h-8 rounded-full"
                      />

                      <span className="text-sm">
                        {s.user.first_name} {s.user.last_name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSubmit(handleSave)}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg shadow-xl text-white ${
                isLoading ? "bg-neutral04 cursor-not-allowed" : "bg-primary03 hover:opacity-90"
              }`}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
