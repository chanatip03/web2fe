"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentLandingPage from "./studentLandingPage";
import { IClassroomMember, Classroom } from "@/domain/classroom";
import { classroomService, classroomMemberService } from "@/services/controller";

export default function Page() {
    const params = useParams();
    const classroomId = Number(params.id);

    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [members, setMembers] = useState<IClassroomMember[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [cData, mData] = await Promise.all([
                classroomService.getclassroomById(classroomId),
                classroomMemberService.getMembers(classroomId)
            ]);
            setClassroom(cData);
            setMembers(mData || []);
        } catch (err) {
            console.error("Failed to load members page data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classroomId) {
            loadData();
        }
    }, [classroomId]);

    const handleDeleteMember = async (studentId: number) => {
        if (!confirm("Are you sure you want to remove this student?")) return;
        try {
            await classroomMemberService.deleteMember(classroomId, studentId);
            setMembers(prev => prev.filter(m => m.student.id !== studentId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete member");
        }
    };

    if (loading || !classroom) return <div>Loading...</div>;

    return <StudentLandingPage classroom={classroom} members={members} onDeleteMember={handleDeleteMember} />;
}