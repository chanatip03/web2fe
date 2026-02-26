import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    Paper,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from "@mui/icons-material/Person";
import { IClassroomMember } from "@/domain/classroom";

interface StudentTableComponentsProps {
     classroomMember: IClassroomMember;
}

const StudentTable = ({ classroomMember }: StudentTableComponentsProps) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table
                size="medium"
                sx={{
                    "& th, & td": {
                        textAlign: "center",
                        verticalAlign: "middle",
                    },
                    "& td": {
                        py: 0.8,
                    },
                    backgroundColor:"#FFFFFF",
                }}
            >
                <TableHead>
                    <TableRow >
                        <TableCell><h4>Profile</h4></TableCell>
                        <TableCell><h4>Student ID</h4></TableCell>
                        <TableCell><h4>Name</h4></TableCell>
                        <TableCell><h4>Email</h4></TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {classroomMember.student.map((student, index) => (
                        <TableRow
                            key={student.id}
                            sx={{
                                backgroundColor:
                                    index % 2 ? "#FFFFFF" : "var(--color-secondary01)",
                            }}
                        >
                            <TableCell align="center">
                                {student.user?.imageUrl ? (
                                    <Avatar
                                        src={student.user.imageUrl}
                                        alt={`${student.user.firstName} ${student.user.lastName}`}
                                        sx={{ width: 46, height: 46 , mx: "auto",}}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            backgroundColor: "var(--color-neutral03)",
                                            mx: "auto",
                                        }}
                                    >
                                        <PersonIcon sx={{ color: "#FFFFFF", fontSize: 24 }} />
                                    </Avatar>
                                )}
                            </TableCell>

                            <TableCell><h5 className="text-[18px]">{student.studentId}</h5></TableCell>

                            <TableCell>
                                <p className="p2">{student.user.firstName} {student.user.lastName}</p>
                            </TableCell>

                            <TableCell><p className="p2">{student.user.email}</p></TableCell>

                            <TableCell align="right">
                                <IconButton color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StudentTable;