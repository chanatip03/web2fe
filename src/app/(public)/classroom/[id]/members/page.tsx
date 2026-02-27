import StudentLandingPage from "./studentLandingPage";
import { IClassroomMember } from "@/domain/classroom";


const mockClassroomMember: IClassroomMember = 

    {
        id: 1,
        classroom: {
            id: 1,
            name: "Web Programming II",
            description: "This is a web programming class.",
            semester: "2024-1",
            code: "XCYGI22",
            excelLink: "https://example.com/excel",
            learningOutcome: "Learn how to build web applications.",
        },
        student: [
            {

                id: 1,
                studentId: "66090500401",
                user: {
                    id: 1,
                    firstName: "Benjamin",
                    lastName: "Deemak",
                    email: "Benjamin.Deem@gmail.com",
                    imageUrl: "https://i.pravatar.cc/100?img=1",
                }
            },
            {
                id: 2,
                studentId: "66090500402",
                user: {
                    id: 2,
                    firstName: "Jennie",
                    lastName: "Ree",
                    email: "Jennie.Ree@gmail.com",
                    imageUrl: "https://i.pravatar.cc/100?img=2",
                }
            },
            {
                id: 3,
                studentId: "66090500403",
                user: {
                    id: 3,
                    firstName: "Somchai",
                    lastName: "Jaidee",
                    email: "Somchai.Jaid@gmail.com",
                    imageUrl: "https://i.pravatar.cc/100?img=3",
                }
            },
            {
                id: 4,
                studentId: "66090500404",
                user: {
                    id: 4,
                    firstName: "Micha",
                    lastName: "Thomson",
                    email: "Micha.Thom@gmail.com",
                    imageUrl: "https://i.pravatar.cc/100?img=4",
                }
            },
            {
                id: 5,
                studentId: "66090500405",
                user: {
                    id: 5,
                    firstName: "Tula",
                    lastName: "Patanaboonmee",
                    email: "Tula.pata@gmail.com",
                    imageUrl: "",
                }
            },]
    };


export default function Page() {
    return <StudentLandingPage classroomMember={mockClassroomMember} />;
}