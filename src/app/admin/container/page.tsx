"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Link as MuiLink,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import AdminLayout from "@/components/AdminLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import type { Container, ContainerDetails, ContainerPort } from "@/domain/admin";
import { userService } from "@/services/controller";

const ROWS_PER_PAGE = 5;
const headCellSx = { fontWeight: 700, color: "var(--color-primary03)" } as const;

type ToastState = {
  message: string;
  severity: AlertColor;
};

function formatMemory(memoryUsageMB?: number | null): string {
  if (memoryUsageMB === null || memoryUsageMB === undefined) return "—";
  return Number(memoryUsageMB).toFixed(2);
}

function formatStudentId(studentId?: string | null): string {
  return studentId?.trim() || "—";
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString();
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

/**
 * Replace `localhost` in a URL with the actual server hostname.
 * Also resolves relative `/preview/...` paths to absolute URLs.
 */
function normalizePreviewUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Relative path → prepend current origin (points to the backend server)
  if (url.startsWith("/")) {
    // Use NEXT_PUBLIC_API_URL origin if available, otherwise window origin
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
    try {
      const apiOrigin = apiBase ? new URL(apiBase).origin : window.location.origin;
      return `${apiOrigin}${url}`;
    } catch {
      return `${window.location.origin}${url}`;
    }
  }

  // Replace localhost / 127.0.0.1 with the real server hostname
  if (/localhost|127\.0\.0\.1/.test(url)) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
    let serverHost = window.location.hostname;
    try {
      if (apiBase) serverHost = new URL(apiBase).hostname;
    } catch { /* keep window.location.hostname */ }
    return url.replace(/localhost|127\.0\.0\.1/g, serverHost);
  }

  return url;
}

/**
 * Build a direct `http://host:port` URL from extraPorts.
 * Prefers the port whose serviceName matches "frontend" / "app" / "web".
 */
function getDirectUrl(extraPorts: ContainerPort[]): string | null {
  if (!extraPorts || extraPorts.length === 0) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  let serverHost = window.location.hostname;
  try {
    if (apiBase) serverHost = new URL(apiBase).hostname;
  } catch { /* keep window.location.hostname */ }

  const preferred = extraPorts.find((p) =>
    ["frontend", "app", "web"].includes((p.serviceName ?? "").toLowerCase()),
  ) ?? extraPorts[0];

  return preferred?.hostPort ? `http://${serverHost}:${preferred.hostPort}` : null;
}

function getStatusChipColor(status: string): "success" | "default" | "error" | "warning" {
  if (status === "running") return "success";
  if (status === "stopped") return "default";
  if (status === "error") return "error";
  return "warning";
}

function canStartContainer(status: string): boolean {
  return !["running", "analyzing", "building", "deploying"].includes(status);
}

function canStopContainer(status: string, canStop?: boolean): boolean {
  return Boolean(canStop) && status !== "stopped";
}

export default function ContainerPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Container | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<Container | null>(null);
  const [details, setDetails] = useState<ContainerDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [actionTargetId, setActionTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleCloseDetails = () => {
    setDetailsTarget(null);
    setDetails(null);
    setDetailsError("");
  };

  const fetchContainers = async (): Promise<Container[]> => {
    setIsLoading(true);
    setPageError("");

    try {
      const nextContainers = await userService.getContainers();
      setContainers(nextContainers);
      setPage((currentPage) => {
        const totalPages = Math.max(1, Math.ceil(nextContainers.length / ROWS_PER_PAGE));
        return Math.min(currentPage, totalPages);
      });
      return nextContainers;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch deployments");
      setContainers([]);
      setPageError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContainerDetails = async (container: Container): Promise<void> => {
    setDetailsTarget(container);
    setDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const nextDetails = await userService.getContainerDetails(container.id);
      setDetails(nextDetails);
    } catch (error) {
      setDetailsError(getErrorMessage(error, "Failed to fetch deployment details"));
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    void fetchContainers();
  }, []);

  const handleRefreshDetails = async () => {
    if (!detailsTarget) return;

    const nextContainers = await fetchContainers();
    const nextTarget = nextContainers.find((container) => container.id === detailsTarget.id) || detailsTarget;
    await fetchContainerDetails(nextTarget);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await userService.deleteContainer(deleteTarget.id);
      await fetchContainers();
      handleCloseDetails();
      setToast({
        message: `Deployment for "${deleteTarget.assignmentName}" has been deleted`,
        severity: "success",
      });
    } catch (error) {
      setToast({
        message: getErrorMessage(error, "Failed to delete container"),
        severity: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleContainer = async (container: Container) => {
    const normalizedStatus = container.status.toLowerCase();
    const shouldStop = normalizedStatus === "running";

    if (!shouldStop && !canStartContainer(normalizedStatus)) {
      return;
    }

    if (shouldStop && !canStopContainer(normalizedStatus, container.canStop)) {
      return;
    }

    setActionTargetId(container.id);

    try {
      if (shouldStop) {
        await userService.stopContainer(container.id);
      } else {
        await userService.startContainer(container.id);
      }

      const nextContainers = await fetchContainers();
      const nextTarget = nextContainers.find((item) => item.id === container.id) || container;

      if (detailsTarget?.id === container.id) {
        await fetchContainerDetails(nextTarget);
      }

      setToast({
        message: `Deployment for "${container.assignmentName}" has been ${shouldStop ? "stopped" : "started"}`,
        severity: "success",
      });
    } catch (error) {
      setToast({
        message: getErrorMessage(error, `Failed to ${shouldStop ? "stop" : "start"} container`),
        severity: "error",
      });
    } finally {
      setActionTargetId(null);
    }
  };

  const handleOpenPreview = () => {
    const url = getDirectUrl(details?.extraPorts ?? []) ?? normalizePreviewUrl(details?.previewUrl);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const totalPages = Math.ceil(containers.length / ROWS_PER_PAGE);
  const paginatedData = containers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  const detailStatus = (detailsTarget?.status || details?.containerState || details?.status || "unknown").toLowerCase();
  const detailContainerState = (details?.containerState || detailsTarget?.status || details?.status || "unknown").toLowerCase();

  return (
    <AdminLayout>
      <PageHeader
        title="Container"
        totalCount={containers.filter((container) => container.canStop).length}
        countLabel="Active"
      />

      <TableContainer
        component={Paper}
        elevation={0}
        className="border border-neutral02"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-primary01)" }}>
              <TableCell sx={headCellSx}>ASSIGNMENT</TableCell>
              <TableCell sx={headCellSx}>STUDENT ID / DEPLOYMENT ID</TableCell>
              <TableCell align="center" sx={headCellSx}>MEMORY (MB)</TableCell>
              <TableCell align="center" sx={headCellSx}>OWNER</TableCell>
              <TableCell align="center" sx={headCellSx}>STATUS</TableCell>
              <TableCell align="center" sx={{ width: 112 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <CircularProgress size={20} />
                    <Typography color="var(--color-neutral04)">Loading deployments...</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color={pageError ? "error" : "var(--color-neutral04)"}>
                    {pageError || "No deployments found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((container, index) => {
                const normalizedStatus = container.status.toLowerCase();
                const isRunning = normalizedStatus === "running";
                const canToggle = isRunning
                  ? canStopContainer(normalizedStatus, container.canStop)
                  : canStartContainer(normalizedStatus);

                return (
                  <TableRow
                    key={container.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 1 ? "#f5f8fc" : "#ffffff",
                      transition: "background-color 0.15s",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{container.assignmentName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                        <Typography sx={{ fontWeight: 600, color: "#212121" }}>{formatStudentId(container.studentId)}</Typography>
                        <Typography variant="caption" color="var(--color-neutral04)">
                          Deployment ID: {container.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{formatMemory(container.memoryUsageMB)}</TableCell>
                    <TableCell align="center">{container.teacherName}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={container.status}
                        size="small"
                        color={getStatusChipColor(container.status)}
                        variant={container.status === "running" ? "filled" : "outlined"}
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={() => void fetchContainerDetails(container)}
                          sx={{ color: "var(--color-primary03)" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isRunning ? "Stop container" : "Start container"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => void handleToggleContainer(container)}
                            disabled={!canToggle || actionTargetId === container.id}
                            sx={{
                              color: isRunning ? "var(--color-accent03)" : "var(--color-success01)",
                              "&:hover": {
                                backgroundColor: isRunning ? "var(--color-accent01)" : "#d7f0cc",
                              },
                            }}
                          >
                            {actionTargetId === container.id
                              ? <CircularProgress size={16} sx={{ color: "inherit" }} />
                              : isRunning
                                ? <StopCircleOutlinedIcon fontSize="small" />
                                : <PlayCircleOutlineIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Dialog
        open={detailsTarget !== null}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: { borderRadius: "12px" },
          },
        }}
      >
        <div className="flex items-center justify-between bg-primary03 px-12 py-3 text-white">
          <h3>Deployment Details</h3>
          <IconButton onClick={handleCloseDetails}>
            <CloseIcon className="text-white" />
          </IconButton>
        </div>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--color-primary03)" }}>
                {detailsTarget?.assignmentName}
              </Typography>
              <Typography sx={{ color: "var(--color-neutral05)", fontWeight: 500 }}>
                Student ID: {formatStudentId(detailsTarget?.studentId)}
              </Typography>
            </Box>

            {detailsLoading ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} />
                <Typography color="text.secondary">Loading deployment details...</Typography>
              </Stack>
            ) : detailsError ? (
              <Alert severity="error">{detailsError}</Alert>
            ) : details ? (
              <>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap">
                  <Chip label={`Status: ${detailStatus}`} color={getStatusChipColor(detailStatus)} sx={{ textTransform: "capitalize" }} />
                  <Chip label={`Container: ${detailContainerState}`} variant="outlined" sx={{ textTransform: "capitalize" }} />
                  <Chip label={`Step: ${details.currentStep ?? "—"}`} variant="outlined" />
                </Stack>

                <Stack spacing={1}>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Teacher:</strong> {detailsTarget?.teacherName || "—"}</Typography>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Deployment ID:</strong> {detailsTarget?.id || "—"}</Typography>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Student ID:</strong> {formatStudentId(detailsTarget?.studentId)}</Typography>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Image Tag:</strong> {details.imageTag || "—"}</Typography>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Updated:</strong> {formatDateTime(details.updatedAt)}</Typography>
                  <Typography sx={{ color: "#212121" }}><strong style={{ color: "var(--color-primary03)" }}>Memory:</strong> {formatMemory(detailsTarget?.memoryUsageMB)} MB</Typography>
                  <Typography sx={{ color: "#212121" }}>
                    <strong style={{ color: "var(--color-primary03)" }}>Preview URL:</strong>{" "}
                    {(() => {
                      // Prefer the backend's previewUrl since it now includes entry points (e.g. /landing.html)
                      const normalizedUrl = normalizePreviewUrl(details.previewUrl);
                      const directUrl = getDirectUrl(details.extraPorts);
                      const displayUrl = normalizedUrl || directUrl;
                      return displayUrl ? (
                        <MuiLink
                          href={displayUrl}
                          target="_blank"
                          rel="noreferrer"
                          underline="hover"
                          sx={{
                            color: "var(--color-secondary04)",
                            fontWeight: 600,
                            wordBreak: "break-all",
                          }}
                        >
                          {displayUrl}
                        </MuiLink>
                      ) : " —";
                    })()}
                  </Typography>
                </Stack>

                {details.extraPorts.length > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1, color: "var(--color-primary03)" }}>Published Ports</Typography>
                    <Stack spacing={0.75}>
                      {details.extraPorts.map((port, index) => (
                        <Typography key={`${port.containerPort}-${port.hostPort}-${index}`} sx={{ color: "#212121" }}>
                          {port.hostPort} → {port.containerPort}{port.protocol ? `/${port.protocol}` : ""}{port.serviceName ? ` (${port.serviceName})` : ""}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                {details.errorMessage && (
                  <Alert severity="warning">{details.errorMessage}</Alert>
                )}

                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1, color: "var(--color-primary03)" }}>Runtime Logs</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 260, overflow: "auto", bgcolor: "#0f172a" }}>
                    {details.runtimeLogs.length === 0 ? (
                      <Typography sx={{ color: "#cbd5e1" }}>No runtime logs available</Typography>
                    ) : (
                      <Stack spacing={0.75}>
                        {details.runtimeLogs.map((entry) => (
                          <Typography
                            key={entry.id}
                            component="pre"
                            sx={{
                              m: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              color: entry.level === "error" ? "#fca5a5" : "#e2e8f0",
                              fontSize: 13,
                              fontFamily: "monospace",
                            }}
                          >
                            {entry.message}
                          </Typography>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1, color: "var(--color-primary03)" }}>Build Logs</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 220, overflow: "auto", bgcolor: "#111827" }}>
                    <Typography
                      component="pre"
                      sx={{
                        m: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        color: "#d1d5db",
                        fontSize: 13,
                        fontFamily: "monospace",
                      }}
                    >
                      {details.buildLogs || "No build logs available"}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ pt: 0.5 }}>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => setDeleteTarget(detailsTarget)}
                    disabled={!detailsTarget || detailsLoading}
                  >
                    Delete Container
                  </Button>
                </Box>
              </>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => void handleRefreshDetails()} disabled={!detailsTarget || detailsLoading}>
            Refresh
          </Button>
          <Button
            startIcon={<OpenInNewOutlinedIcon />}
            onClick={handleOpenPreview}
            disabled={
              (!details?.previewUrl && (details?.extraPorts ?? []).length === 0) ||
              detailStatus !== "running"
            }
          >
            Open Preview
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Container"
        message={`Are you sure you want to delete "${deleteTarget?.assignmentName}"? This deployment record and its runtime will be removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast?.severity || "info"} onClose={() => setToast(null)}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}