"use client";

import { useEffect, useState } from "react";
import {
  Box,
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
  CircularProgress,
  Typography,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import AdminLayout from "@/components/AdminLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import EditTeacherModal from "@/components/modal/editTeacherModal";
import { userService } from "@/services/controller";
import type { AdminTeacher } from "@/domain/admin";

const ROWS_PER_PAGE = 5;

const headCellSx = { fontWeight: 700, color: "var(--color-primary03)" } as const;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<AdminTeacher | null>(null);
  const [editTarget, setEditTarget] = useState<AdminTeacher | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;

    const loadTeachers = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const nextTeachers = await userService.getAdminTeachers(search || undefined);
        if (!active) return;

        setTeachers(nextTeachers);
        setPage((currentPage) => {
          const totalPages = Math.max(1, Math.ceil(nextTeachers.length / ROWS_PER_PAGE));
          return Math.min(currentPage, totalPages);
        });
      } catch (error) {
        if (!active) return;

        setTeachers([]);
        setPageError(getErrorMessage(error, "Failed to load teachers"));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadTeachers();

    return () => {
      active = false;
    };
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await userService.deleteUser(deleteTarget.id);
    setTeachers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setToast(`Teacher "${deleteTarget.first_name} ${deleteTarget.last_name}" has been deleted`);
    setDeleteTarget(null);
  };

  const totalPages = Math.ceil(teachers.length / ROWS_PER_PAGE);
  const paginatedData = teachers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <AdminLayout>
      {/* Top: Title + Search */}
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Teacher" totalCount={teachers.length} />
        <TextField
          size="small"
          placeholder="Search teacher"
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
              <TableCell sx={headCellSx}>Name</TableCell>
              <TableCell sx={headCellSx}>Email</TableCell>
              <TableCell sx={headCellSx}>Academy</TableCell>
              <TableCell align="center" sx={headCellSx}>Certificate</TableCell>
              <TableCell align="center" sx={headCellSx}>Status</TableCell>
              <TableCell align="center" sx={{ width: 100 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Box className="flex items-center justify-center gap-3">
                    <CircularProgress size={22} />
                    <Typography color="var(--color-neutral04)">Loading teachers...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : pageError ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Alert severity="error" sx={{ justifyContent: "center" }}>
                    {pageError}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="var(--color-neutral04)">
                    {search ? "No teachers found" : "No teachers"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((teacher, idx) => (
                <TableRow
                  key={teacher.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 1 ? "#f5f8fc" : "#ffffff",
                    transition: "background-color 0.15s",
                  }}
                >
                  <TableCell align="center">
                    <Avatar
                      src={teacher.imageUrl}
                      sx={{ width: 36, height: 36, mx: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{teacher.first_name} {teacher.last_name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{teacher.academy || "—"}</TableCell>
                  <TableCell align="center">
                    {teacher.certificateUrl ? (
                      <MuiLink
                        href={teacher.certificateUrl}
                        target="_blank"
                        underline="hover"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "var(--color-primary03)",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        <FindInPageOutlinedIcon fontSize="small" />
                        Certificate
                      </MuiLink>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={teacher.isApproved ? "Approved" : "Pending"}
                      size="small"
                      color={teacher.isApproved ? "success" : "warning"}
                      variant={teacher.isApproved ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setEditTarget(teacher)}
                        sx={{ color: "var(--color-primary03)" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget(teacher)}
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
        title="Delete Teacher"
        message={`Are you sure you want to delete "${deleteTarget ? `${deleteTarget.first_name} ${deleteTarget.last_name}` : ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <EditTeacherModal
        open={editTarget !== null}
        teacher={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={(updated) => {
          setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          setToast(`Teacher "${updated.first_name} ${updated.last_name}" has been updated`);
        }}
      />

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
