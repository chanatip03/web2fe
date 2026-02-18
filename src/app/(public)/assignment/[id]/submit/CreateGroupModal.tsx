"use client";

import { useForm } from "react-hook-form";
import { mockStudents, Student, Group, mockCurrentStudent } from "./mockGroup";
import { RHFTextField } from "@/components/form/RHFTextField";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (group: Group) => void;
}

interface FormValues {
  groupName: string;
}

export default function CreateGroupModal({ open, onClose, onSave }: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      groupName: "",
    },
    mode: "onSubmit",
  });

  const [members, setMembers] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setMembers((prev) => {
        if (prev.find((m) => m.id === mockCurrentStudent.id)) return prev;
        return [mockCurrentStudent, ...prev];
      });
    }
  }, [open]);

  const toggleMember = (s: Student) => {
    if (members.find((m) => m.id === s.id))
      setMembers(members.filter((m) => m.id !== s.id));
    else setMembers([...members, s]);
  };

  const handleSave = (data: FormValues) => {
    onSave({
      id: Date.now(),
      name: data.groupName,
      projectId: 1,
      members: members.map((m, i) => ({
        id: i,
        student: m,
      })),
    });

    reset();
    setMembers([]);
    onClose();
  };

  if (!open) return null;

  const filteredStudents = mockStudents.filter((s) =>
    `${s.user.firstName} ${s.user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-w-[95vw] rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-primary03 text-white px-6 py-4 flex justify-between items-center">
          <h4 className="font-bold">Manage Group</h4>
          <button onClick={onClose} className="text-xl">✕</button>
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
                      {m.user.firstName} {m.user.lastName}
                    </span>

                    <button
                      onClick={() => toggleMember(m)}
                      disabled={m.id === mockCurrentStudent.id}
                      className={`ml-1 ${
                        m.id === mockCurrentStudent.id
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
                        {s.user.firstName} {s.user.lastName}
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
              className="bg-primary03 text-white px-6 py-2 rounded-lg shadow-xl hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
