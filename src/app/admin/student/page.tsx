"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AdminLayout from "@/components/AdminLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { adminService } from "@/services/controller";
import type { AdminStudent } from "@/domain/admin";

const ROWS_PER_PAGE = 5;

const headCellSx = { fontWeight: 700, color: "var(--color-primary03)" } as const;

export default function StudentPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* confirm dialog */
  const [deleteTarget, setDeleteTarget] = useState<AdminStudent | null>(null);
  /* snackbar */
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminService.getStudents(search || undefined).then(setStudents);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await adminService.deleteStudent(deleteTarget.id);
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setToast(`Student "${deleteTarget.name}" has been deleted`);
    setDeleteTarget(null);
  };

  const totalPages = Math.ceil(students.length / ROWS_PER_PAGE);
  const paginatedData = students.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <AdminLayout>
      {/* Top: Title + Search */}
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Student" totalCount={students.length} />
        <TextField
          size="small"
          placeholder="Search student"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ width: 260, mb: 0 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--color-neutral04)" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <TableContainer
        component={Paper}
        elevation={0}
        className="border border-neutral02"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-primary01)" }}>
              <TableCell align="center" sx={headCellSx}>Profile</TableCell>
              <TableCell align="center" sx={headCellSx}>Student ID</TableCell>
              <TableCell sx={headCellSx}>Name</TableCell>
              <TableCell sx={headCellSx}>Email</TableCell>
              <TableCell sx={headCellSx}>Academy</TableCell>
              <TableCell align="center" sx={{ width: 100 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="var(--color-neutral04)">
                    {search ? "No students found" : "No students"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((student, idx) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 1 ? "#f5f8fc" : "#ffffff",
                    transition: "background-color 0.15s",
                  }}
                >
                  <TableCell align="center">
                    <Avatar
                      src={student.imageUrl}
                      sx={{ width: 36, height: 36, mx: "auto" }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {student.studentId}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{student.academy}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: "var(--color-primary03)" }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget(student)}
                        sx={{
                          color: "var(--color-accent03)",
                          "&:hover": { backgroundColor: "var(--color-accent01)" },
                        }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setToast("")}>
          {toast}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
