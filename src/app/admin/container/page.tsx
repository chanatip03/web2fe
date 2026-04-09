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
  Tooltip,
  Snackbar,
  Alert,
  Typography,
  Chip,
} from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AdminLayout from "@/components/AdminLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { adminService } from "@/services/controller";
import type { Container } from "@/domain/admin";

const ROWS_PER_PAGE = 5;

const headCellSx = { fontWeight: 700, color: "var(--color-primary03)" } as const;

export default function ContainerPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [page, setPage] = useState(1);

  /* confirm dialog */
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  /* snackbar */
  const [toast, setToast] = useState("");

  useEffect(() => {
    adminService.getContainers().then(setContainers);
  }, []);

  const handleStop = async () => {
    if (!confirmTarget) return;
    await adminService.stopContainer(confirmTarget);
    const name = containers.find((c) => c.id === confirmTarget)?.name;
    setContainers((prev) => prev.filter((c) => c.id !== confirmTarget));
    setConfirmTarget(null);
    setToast(`Container "${name}" has been stopped`);
  };

  const totalPages = Math.ceil(containers.length / ROWS_PER_PAGE);
  const paginatedData = containers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <AdminLayout>
      <PageHeader title="Container" totalCount={containers.length} countLabel="Running" />

      <TableContainer
        component={Paper}
        elevation={0}
        className="border border-neutral02"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-primary01)" }}>
              <TableCell sx={headCellSx}>CONTAINER</TableCell>
              <TableCell align="center" sx={headCellSx}>CPU %</TableCell>
              <TableCell align="center" sx={headCellSx}>Memory usage(MB)</TableCell>
              <TableCell align="center" sx={headCellSx}>Uptime</TableCell>
              <TableCell align="center" sx={headCellSx}>teacher</TableCell>
              <TableCell align="center" sx={{ width: 60 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="var(--color-neutral04)">
                    No running containers
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((container, idx) => (
                <TableRow
                  key={container.id}
                  hover
                  sx={{
                    backgroundColor: idx % 2 === 1 ? "#f5f8fc" : "#ffffff",
                    transition: "background-color 0.15s",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{container.name}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${container.cpuPercent}%`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor:
                          container.cpuPercent > 10
                            ? "var(--color-accent01)"
                            : "var(--color-primary01)",
                        color:
                          container.cpuPercent > 10
                            ? "var(--color-accent04)"
                            : "var(--color-primary04)",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{container.memoryUsageMB}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {container.uptime}
                  </TableCell>
                  <TableCell align="center">{container.teacherName}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Stop container">
                      <IconButton
                        size="small"
                        onClick={() => setConfirmTarget(container.id)}
                        sx={{
                          color: "var(--color-accent03)",
                          "&:hover": { backgroundColor: "var(--color-accent01)" },
                        }}
                      >
                        <StopCircleIcon />
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
        open={confirmTarget !== null}
        title="Stop Container"
        message={`Are you sure you want to stop "${containers.find((c) => c.id === confirmTarget)?.name}"? The container will be terminated.`}
        confirmLabel="Stop"
        onConfirm={handleStop}
        onCancel={() => setConfirmTarget(null)}
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
