"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  Typography,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IProjectType } from "@/domain/project";
import { Classroom } from "@/domain/classroom";

interface IAssignment {
  id: number;
  name: string;
  detail: string;
  isGroup: boolean;
  isPublic: boolean;
  startDate: Date;
  dueDate: Date;
  projectType?: IProjectType;
  classroom?: Classroom;
}


const mockAssignment: IAssignment = {
  id: 1,
  name: "Final Project",
  detail:
    "In this project, you will create a simple web application to present your daily life in English. You will practice both web development skills and English writing. Your web app should have at least 3 pages or sections.In this project, you will create a simple web application to present your daily life in English. You will practice both web development skills and English writing. Your web app should have at least 3 pages or sections.",
  startDate: new Date("2025-04-07T11:01:00"),
  dueDate: new Date("2025-04-09T12:00:00"),
  isGroup: true,
  isPublic: true,
  projectType: {
    id: 1,
    name: "Backend",
  },
  classroom: {
    id: "1",
    name: "Web Programming II",
    description: "This is a web programming class.",
    semester: "2024-1",
    code: "XCYGI22",
    teacher: {
      id: "1",
      certificateUrl: "https://example.com/cert.pdf",
      isApproved: true,
      user: {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        academy: "kmutt",
      },
    },
  },
};

interface IProject {
  id: number;
  groupName: string;
  sendDate: Date;
  isLate: boolean;
  isComplete: boolean;
  languages: string[];
}

const mockProjects: IProject[] = [
  {
    id: 1,
    groupName: "G. Zhī Shēng Hào",
    sendDate: new Date("2025-04-07"),
    isLate: false,
    isComplete: true,
    languages: ["Next.js"],
  },
  {
    id: 2,
    groupName: "G. PixelPioneers",
    sendDate: new Date("2025-04-10"),
    isLate: true,
    isComplete: true,
    languages: ["Golang", "React"],
  },
  {
    id: 3,
    groupName: "G. TechTitans",
    sendDate: new Date("2025-04-08"),
    isLate: false,
    isComplete: false,
    languages: ["Express.js", "React"],
  },
];

export default function TeacherAssignmentInfoPage() {
  const [tab, setTab] = useState<"inprogress" | "complete">("inprogress");

  const filteredProjects = mockProjects.filter((project) =>
    tab === "complete"
      ? project.isComplete
      : !project.isComplete
  );

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs separator="/">
          <Link href="/classroom/listclassroom">Home</Link>
          <span>{mockAssignment.classroom?.name}</span>
          <Link
            href={`/classroom/${mockAssignment.classroom?.id}/assignment`}
          >
            Assignment
          </Link>
          <span className="text-black font-medium">{mockAssignment.name}</span>
        </Breadcrumbs>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h1>{mockAssignment.name}</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create TestCase
        </Button>
      </div>


      <div className="flex gap-2 mb-2">
        <h5>Due Date</h5>

        <p className="text-accent03 p2">

          {mockAssignment.dueDate.toLocaleString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}

        </p>

      </div>


      <div className="mb-6">
        <h5 className="mb-2">Assignment Detail</h5>

        <div>
          <p className="p2">{mockAssignment.detail}</p>
        </div>
      </div>

      <Paper sx={{ backgroundColor: "#ffffff" }}>
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          variant="fullWidth"
          sx={{
            borderRadius: "8px 8px 0 0",
            borderBottom: "1px solid #C7C7C7",
            height: "62px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >

          <Tab
            label="Inprogress"
            value="inprogress"
            sx={{
              textTransform: "none",
              borderRadius: "8px 0 0 0",
              height: "62px",
              fontSize: "18px",
              fontWeight: "bold",

              "&.Mui-selected": {
                backgroundColor: "#0D47A1",
                color: "#ffffff",
              },
            }}
          />

          <Tab
            label="Complete"
            value="complete"
            sx={{
              textTransform: "none",
              borderRadius: "0 8px 0 0",
              height: "62px",
              fontSize: "18px",
              fontWeight: "bold",

              "&.Mui-selected": {
                backgroundColor: "#0D47A1",
                color: "#ffffff",
              },
            }}
          />

        </Tabs>


        <Table>

          <TableHead>

            <TableRow
              sx={{
                backgroundColor: "#ffffff",
              }}
            >

              <TableCell align="center"  sx={{ width: "25%" }}>
                Group name
              </TableCell>

              <TableCell align="center"  sx={{ width: "20%" }}>
                Send date
              </TableCell>

              <TableCell align="center"  sx={{ width: "15%" }}>
                Status
              </TableCell>

              <TableCell align="center"  sx={{ width: "35%" }}>
                Language
              </TableCell>

              <TableCell sx={{ width: "15%" }}/>

            </TableRow>

          </TableHead>



          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>

                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ height: 300 }}
                >

                  <Typography
                    color="text.secondary"
                    fontWeight={600}
                  >
                    No student submitted
                  </Typography>

                </TableCell>

              </TableRow>

            ) : (

              filteredProjects.map((project) => (

                <TableRow key={project.id} sx={{
                  "& td:first-of-type": {
                    px: 6,
                  },
                }}>

                  <TableCell>
                    <h5>{project.groupName}</h5>
                  </TableCell>

                  <TableCell align="center">

                    {project.sendDate.toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}

                  </TableCell>

                  <TableCell align="center">

                    <div
                      className={`inline-block px-4 py-2 w-[78px] rounded-md text-white
                       ${project.isLate
                          ? "bg-[#FFC107]"
                          : "bg-[#3CB40B]"
                        }
                     `}
                    >
                      <h6>{project.isLate ? "Late" : "Ontime"}</h6>
                    </div>

                  </TableCell>

                  <TableCell align="left">

                    {project.languages.map((lang) => (

                      <Chip
                        key={lang}
                        label={lang}
                        size="small"
                        sx={{ mr: 1, p: 2 }}
                      />

                    ))}

                  </TableCell>


                  <TableCell align="right" sx={{ pr: 6 }} >

                    <Button
                      variant="contained"
                      size="small"
                      sx={{ px: 4, }}
                    >
                      Preview
                    </Button>

                  </TableCell>

                </TableRow>

              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}