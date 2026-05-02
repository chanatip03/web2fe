import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  data: {
    status?: string;
    download_url?: string;
    message?: string;
  } | null;
}

function hasInlineScanDetails(data: Props["data"]): boolean {
  if (!data) return false;
  return Array.isArray((data as any).issues) || Array.isArray((data as any).languages) || typeof (data as any).type === "string";
}

export default function CyberScanResultModal({ open, onClose, data }: Props) {
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchWarning, setFetchWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setDetailData(data);
    setFetchWarning(null);

    if (hasInlineScanDetails(data) || !data?.download_url) {
      return;
    }

    if (open && data?.download_url) {
      const fetchData = async () => {
        setLoading(true);
        setFetchWarning(null);
        try {
          const res = await fetch(data.download_url!);
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.detail || errBody.message || "Failed to fetch detailed scan results.");
          }
          const json = await res.json();
          setDetailData(json);
        } catch (err: any) {
          setFetchWarning(err?.message || "Failed to fetch detailed scan results.");
          setDetailData(data); // Fallback to the saved summary data
        } finally {
          setLoading(false);
        }
      };
      void fetchData();
    }
  }, [open, data]);

  if (!data) return null;
  const isScanError = data.status === "error";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <SecurityIcon color="primary" />
        Cyber Security Scan Result
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#f8f9fa", p: 0, minHeight: "200px" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Fetching detailed scan data...</Typography>
          </Box>
        ) : isScanError ? (
          <Box sx={{ color: "error.main", p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan Failed</Typography>
            <Typography variant="body2">{data.message || "An unexpected error occurred during the scan."}</Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative" }}>
            {fetchWarning && (
              <Box sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "#fff8e1", px: 3, py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Unable to load the downloadable `scan.json`, so this view is showing the saved summary instead.
                </Typography>
              </Box>
            )}
            <pre style={{ 
              margin: 0, 
              padding: "20px", 
              fontSize: "13px", 
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all"
            }}>
              {JSON.stringify(detailData, null, 2)}
            </pre>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
