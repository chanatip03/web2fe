// mockGroup.ts

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

export interface Student {
  id: number;
  user: User;
  studentId: string;
}

export interface GroupMember {
  id: number;
  student: Student;
}

export interface Group {
  id: number;
  name: string;
  projectId: number;
  members: GroupMember[];
}

/* ================= MOCK ================= */

export const mockStudents: Student[] = [
  {
    id: 1,
    studentId: "65010001",
    user: {
      id: 1,
      firstName: "Benjamin",
      lastName: "Deemak",
      email: "ben@mail.com",
      imageUrl: "https://i.pravatar.cc/100?img=1",
    },
  },
  {
    id: 2,
    studentId: "65010002",
    user: {
      id: 2,
      firstName: "Jennie",
      lastName: "Ree",
      email: "jen@mail.com",
      imageUrl: "https://i.pravatar.cc/100?img=2",
    },
  },
  {
    id: 3,
    studentId: "65010003",
    user: {
      id: 3,
      firstName: "Somchai",
      lastName: "Jaidee",
      email: "som@mail.com",
      imageUrl: "https://i.pravatar.cc/100?img=3",
    },
  },
    {
    id: 4,
    studentId: "65010004",
    user: {
      id: 4,
      firstName: "Somsak",
      lastName: "Pong",
      email: "som@kmail.com",
      imageUrl: "https://i.pravatar.cc/100?img=4",
    },
  },
];

export const mockCurrentStudent: Student = {
  id: 999,
  studentId: "65010999",
  user: {
    id: 999,
    firstName: "Your",
    lastName: "Name",
    email: "your.name@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=12",
  },
};
