"use client";

import Link from "next/link";
import { Breadcrumbs } from "@mui/material";
import StudentTable from "./studentTable";
import { RHFTextField } from "@/components/form/RHFTextField";
import { IClassroomMember } from "@/domain/classroom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface StudentLandingPageProps {
    classroomMember: IClassroomMember;
}

const searchSchema = z.object({
    search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const StudentLandingPage = ({ classroomMember }: StudentLandingPageProps) => {

const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
});

const handleResetSearch = () => {
    reset({ search: "" });
};

const watchedSearch = watch("search");

return (
    <div className="px-25 py-8">
        <div className="flex flex-col items-start justify-start gap-2 mb-6">
            <Breadcrumbs aria-label="breadcrumb" separator="/" >
                <Link href="/classroom/listclassroom">Home</Link>
                <span>{classroomMember.classroom.name}</span>
                <span className="text-black">Student</span>
            </Breadcrumbs>
        </div>
        <h1 className="-mb-2">Student</h1>
        <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-[18px]">
                     Capacity<span className="text-primary03 font-bold mx-2">
                        {classroomMember.student.length}
                    </span>people
                </p>
            </div>

            <div className="flex items-center gap-4">
                <p className="text-[18px] font-semibold">
                    Classroom code:<span className="font-bold text-h4 text-primary03 ml-2">{classroomMember.classroom.code}</span>
                </p>

                <RHFTextField
                    name="search"
                    control={control}
                    placeholder="Search name member"
                    startIcon={<SearchIcon />}
                    sx={{ width: "300px" }}
                    endIcon={
                    watchedSearch ? (
                        <CloseIcon onClick={handleResetSearch} />
                    ) : (
                        <span className="w-[24px] " />)
                    }
                />
            </div>
        </div>

        <StudentTable classroomMember={classroomMember} />
    </div>
);
};


export default StudentLandingPage;