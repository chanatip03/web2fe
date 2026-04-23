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

export default function CyberScanResultModal({ open, onClose, data }: Props) {
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && data?.download_url) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(data.download_url!, {
            credentials: "include",
          });
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.detail || errBody.message || "Failed to fetch detailed scan results.");
          }
          const json = await res.json();
          setDetailData(json);
        } catch (err: any) {
          setError(err.message);
          setDetailData(data); // Fallback to manifest data
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setDetailData(data);
    }
  }, [open, data]);

  if (!data) return null;

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
        ) : data.status === "error" || error ? (
          <Box sx={{ color: "error.main", p: 3 }}>
            <Typography variant="h6" gutterBottom>Scan Failed</Typography>
            <Typography variant="body2">{error || data.message || "An unexpected error occurred during the scan."}</Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative" }}>
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
