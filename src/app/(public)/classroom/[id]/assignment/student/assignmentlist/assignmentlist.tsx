"use client";

import {
  Box,
  Typography,
  Stack,
  Card,
  Chip,
  Button,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

/* ================= TYPES ================= */

export type AssignmentStatus = "on_time" | "late" | "not_submitted";

export interface Assignment {
  id: number;
  title: string;
  publishDate: string;
  dueDate: string;
  isGroup: boolean;
  status: AssignmentStatus; // เตรียมไว้ตรงกับ backend
}

interface Props {
  apiBase: string;
}

/* ================= MOCK DATA (แทน API) ================= */

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: "Lab 1 List Form",
    publishDate: "2025-03-01T11:00:00",
    dueDate: "2025-03-04T12:00:00",
    isGroup: false,
    status: "on_time",
  },
  {
    id: 2,
    title: "HW Flexbox and Grid",
    publishDate: "2025-03-14T11:01:00",
    dueDate: "2025-03-14T12:00:00",
    isGroup: false,
    status: "late",
  },
  {
    id: 3,
    title: "Final Project",
    publishDate: "2025-04-07T11:00:00",
    dueDate: "2025-04-09T11:01:00",
    isGroup: true,
    status: "not_submitted",
  },
];

/* ================= MAIN COMPONENT ================= */

export default function AssignmentList({ apiBase }: Props) {
  const theme = useTheme();

  const assignments = mockAssignments; // เปลี่ยนเป็น fetch จาก backend ทีหลังได้เลย

  return (
    <Box sx={{ px: 10, py: 8, backgroundColor: theme.palette.background.default }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" mb={1}>
        Home / Web programming / Assignment
      </Typography>

      {/* Page Title */}
      <Typography variant="h2" fontWeight={700} mb={3}>
        Assignment
      </Typography>

      {/* Legend */}
      <Stack direction="row" spacing={3} alignItems="center" mb={4}>
        <Legend color="#4CAF50" label="On-time" />
        <Legend color="#F4B400" label="Late" />
        <Legend color="#BDBDBD" label="Not Sumit" />
      </Stack>

      {/* Header Row */}
      <Grid container sx={{ px: 3, mb: 1 }}>
        <Grid item xs={5}>
          <Typography variant="h6" fontWeight={600}>
            Assignment Name
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" fontWeight={600}>
            Publish Date
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" fontWeight={600}>
            Due Date
          </Typography>
        </Grid>
        <Grid item xs={2} textAlign="right">
          <Typography variant="h6" fontWeight={600}>
            Status
          </Typography>
        </Grid>
      </Grid>

      {/* Assignment Rows */}
      <Stack spacing={2}>
        {assignments.map((a) => (
          <Card
            key={a.id}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <Grid container alignItems="center">
              {/* Name + Type */}
              <Grid item xs={5}>
                <Typography variant="h5" fontWeight={600}>
                  {a.title}
                </Typography>

                <Chip
                  label={a.isGroup ? "Group" : "Individual"}
                  size="small"
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                />
              </Grid>

              {/* Publish Date */}
              <Grid item xs={3}>
                <Typography variant="body2">
                  {dayjs(a.publishDate).format("D MMMM YYYY [at] HH.mm")}
                </Typography>
              </Grid>

              {/* Due Date */}
              <Grid item xs={2}>
                <Typography
                  variant="body2"
                  sx={{
                    color: a.status === "late" ? theme.palette.error.main : "inherit",
                    fontWeight: a.status === "late" ? 600 : 400,
                  }}
                >
                  {dayjs(a.dueDate).format("D MMMM YYYY [at] HH.mm")}
                </Typography>
              </Grid>

              {/* Status Button */}
              <Grid item xs={2} textAlign="right">
                <StatusButton status={a.status} />
              </Grid>
            </Grid>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

/* ================= STATUS BUTTON ================= */

function StatusButton({ status }: { status: AssignmentStatus }) {
  if (status === "on_time") {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#4CAF50",
          "&:hover": { backgroundColor: "#43A047" },
        }}
      >
        Submitted
      </Button>
    );
  }

  if (status === "late") {
    return (
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#F4B400",
          "&:hover": { backgroundColor: "#d89b00" },
        }}
      >
        Late Submitted
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      disabled
      sx={{
        backgroundColor: "#BDBDBD",
        color: "#fff",
      }}
    >
      Not Submitted
    </Button>
  );
}

/* ================= LEGEND ================= */

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}
