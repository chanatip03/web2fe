"use client";

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

interface Props {
    data: any;
}

export default function ScorebookTable({ data }: Props) {

    return (

        <Paper
            variant="outlined"
            sx={{
                width: "100%",
                overflow: "hidden",
            }}
        >

            <Box sx={{ display: "flex", width: "100%" }}>
                <TableContainer
                    sx={{
                        width: 450,
                        minWidth: 250, 
                        flexShrink: 0,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ width: 200 }}>
                                    <h4>Student ID</h4>
                                </TableCell>
                                <TableCell align="center" sx={{ width: 250 }}>
                                    <h4>Name</h4>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.student.map((student: any, index: number) => (
                                <TableRow
                                    key={student.id}
                                    sx={{
                                        backgroundColor:
                                            index % 2
                                                ? "#ffffff"
                                                : "var(--color-secondary01)",
                                    }}
                                >
                                    <TableCell align="center">
                                        <h5>{student.studentId ?? student.student_id ?? "-"}</h5>
                                    </TableCell>
                                    <TableCell>
                                        {student.user?.firstName ?? student.user?.first_name ?? ""}{" "}
                                        {student.user?.lastName ?? student.user?.last_name ?? ""}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>

                <TableContainer
                    sx={{
                        flex: 1,
                        overflowX: "auto",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Table sx={{ width: "max-content" }}>
                        <TableHead>
                            <TableRow>
                                {data.assignments.map((assignment: any) => (

                                    <TableCell
                                        key={assignment.id}
                                        align="center"
                                        sx={{ minWidth: 120 }}
                                    >

                                        {assignment.title}

                                    </TableCell>

                                ))}

                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {data.student.map((student: any, index: number) => (

                                <TableRow
                                    key={student.id}
                                    sx={{
                                        backgroundColor:
                                            index % 2
                                                ? "#ffffff"
                                                : "var(--color-secondary01)",
                                    }}
                                >
                                    {data.assignments.map((assignment: any) => {
                                        const found =
                                            student.project.find(
                                                (p: any) =>
                                                    p.assignmentId === assignment.id
                                            );
                                        return (
                                            <TableCell key={assignment.id} align="center">
                                                <h5 className="text-primary03">{found && found.score != null ? found.score : 0}</h5>
                                            </TableCell>
                                        );

                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TableContainer
                    sx={{
                        width: 200,
                        minWidth: 120,
                        flexShrink: 0,
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>

                                <TableCell align="center">

                                    <h4>Total score</h4>

                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.student.map((student: any, index: number) => {
                                const total = student.project.reduce(
                                    (sum: number, p: any) =>
                                        sum + (p.score ?? 0),
                                    0
                                );

                                return (

                                    <TableRow
                                        key={student.id}
                                        sx={{
                                            backgroundColor:
                                                index % 2
                                                    ? "#ffffff"
                                                    : "var(--color-secondary01)",
                                        }}
                                    >

                                        <TableCell align="center">

                                            <h5 className="text-primary03">{total}</h5>

                                        </TableCell>

                                    </TableRow>

                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>

    );

}