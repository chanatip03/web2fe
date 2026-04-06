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
  Link as MuiLink,
  Snackbar,
  Alert,
  Typography,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import AdminLayout from "@/components/AdminLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { adminService } from "@/services/controller";
import type { AdminTeacherRequest } from "@/domain/admin";

const ROWS_PER_PAGE = 5;

const headCellSx = { fontWeight: 700, color: "var(--color-primary03)" } as const;

export default function RequestPage() {
  const [requests, setRequests] = useState<AdminTeacherRequest[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* confirm dialog */
  const [actionTarget, setActionTarget] = useState<{
    request: AdminTeacherRequest;
    action: "approve" | "reject";
  } | null>(null);
  /* snackbar */
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminService.getTeacherRequests(search || undefined).then(setRequests);
  }, [search]);

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { request, action } = actionTarget;

    if (action === "approve") {
      await adminService.approveRequest(request.id);
      setToast(`Teacher "${request.name}" has been approved`);
    } else {
      await adminService.rejectRequest(request.id);
      setToast(`Request from "${request.name}" has been rejected`);
    }

    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setActionTarget(null);
  };

  const totalPages = Math.ceil(requests.length / ROWS_PER_PAGE);
  const paginatedData = requests.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <AdminLayout>
      {/* Top: Title + Search */}
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Request" totalCount={requests.length} countLabel="Pending" />
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
              <TableCell align="center" sx={{ width: 100 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="var(--color-neutral04)">
                    {search ? "No requests found" : "No pending requests"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((request, idx) => (
                <TableRow
                  key={request.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 1 ? "#f5f8fc" : "#ffffff",
                    transition: "background-color 0.15s",
                  }}
                >
                  <TableCell align="center">
                    <Avatar
                      src={request.imageUrl}
                      sx={{ width: 36, height: 36, mx: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{request.academy}</TableCell>
                  <TableCell align="center">
                    {request.certificateUrl ? (
                      <MuiLink
                        href={request.certificateUrl}
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
                        See Certificate
                      </MuiLink>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setActionTarget({ request, action: "approve" })
                        }
                        sx={{
                          color: "var(--color-success01)",
                          "&:hover": { backgroundColor: "#e8f5e9" },
                        }}
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setActionTarget({ request, action: "reject" })
                        }
                        sx={{
                          color: "var(--color-accent03)",
                          "&:hover": { backgroundColor: "var(--color-accent01)" },
                        }}
                      >
                        <CloseIcon fontSize="small" />
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
        open={actionTarget !== null}
        title={actionTarget?.action === "approve" ? "Approve Teacher" : "Reject Request"}
        message={
          actionTarget?.action === "approve"
            ? `Are you sure you want to approve "${actionTarget?.request.name}" as a teacher?`
            : `Are you sure you want to reject the request from "${actionTarget?.request.name}"?`
        }
        confirmLabel={actionTarget?.action === "approve" ? "Approve" : "Reject"}
        confirmColor={actionTarget?.action === "approve" ? "success" : "error"}
        onConfirm={handleConfirmAction}
        onCancel={() => setActionTarget(null)}
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
