import type { Container, AdminStudent, AdminTeacher, AdminTeacherRequest } from "@/domain/admin";

export const mockContainers: Container[] = [
  {
    id: "c1",
    name: "ProjectFrontEndWEB",
    cpuPercent: 12.4,
    memoryUsageMB: 312,
    uptime: "30 minute",
    teacherName: "Benjamin Deemak",
  },
  {
    id: "c2",
    name: "ProjectBackEndWEB",
    cpuPercent: 7.8,
    memoryUsageMB: 158,
    uptime: "30 minute",
    teacherName: "Benjamin Deemak",
  },
  {
    id: "c3",
    name: "Calculator-peerasit",
    cpuPercent: 5.9,
    memoryUsageMB: 102,
    uptime: "12 minute",
    teacherName: "Somchai Jaidee",
  },
  {
    id: "c4",
    name: "sevenAPI-mamboo",
    cpuPercent: 10.2,
    memoryUsageMB: 183,
    uptime: "60 minute",
    teacherName: "Micha Thomson",
  },
];

export const mockStudents: AdminStudent[] = [
  {
    id: 1,
    studentId: "66090500401",
    name: "Benjamin Deemak",
    email: "Benjamin.Deem@gmail.com",
    academy: "king mongkut's university of technology thonburi",
  },
  {
    id: 2,
    studentId: "66090500402",
    name: "Jennie Ree",
    email: "Jennie.Ree@gmail.com",
    academy: "king mongkut's university of technology thonburi",
  },
  {
    id: 3,
    studentId: "66090500403",
    name: "Somchai Jaidee",
    email: "Somchai.Jaid@gmail.com",
    academy: "king mongkut's university of technology thonburi",
  },
  {
    id: 4,
    studentId: "66090500404",
    name: "Micha Thomson",
    email: "Micha.Thom@gmail.com",
    academy: "king mongkut's university of technology thonburi",
  },
  {
    id: 5,
    studentId: "66090500405",
    name: "Tula patanaboonmee",
    email: "Tula.pata@gmail.com",
    academy: "king mongkut's university of technology thonburi",
  },
];

export const mockTeachers: AdminTeacher[] = [
  {
    id: 1,
    name: "Benjamin Deemak",
    email: "Benjamin.Deem@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/benjamin.pdf",
  },
  {
    id: 2,
    name: "Jennie Ree",
    email: "Jennie.Ree@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/jennie.pdf",
  },
  {
    id: 3,
    name: "Somchai Jaidee",
    email: "Somchai.Jaid @gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/somchai.pdf",
  },
  {
    id: 4,
    name: "Micha Thomson",
    email: "Micha.Thom@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/micha.pdf",
  },
  {
    id: 5,
    name: "Tula patanaboonmee",
    email: "Tula.pata@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/tula.pdf",
  },
];

export const mockTeacherRequests: AdminTeacherRequest[] = [
  {
    id: 1,
    name: "Benjamin Deemak",
    email: "Benjamin.Deem@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/benjamin.pdf",
  },
  {
    id: 2,
    name: "Jennie Ree",
    email: "Jennie.Ree@gmail.com",
    academy: "king mongkut's university of technology thonburi",
    certificateUrl: "/certificates/jennie.pdf",
  },
];
