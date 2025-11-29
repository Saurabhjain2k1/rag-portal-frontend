// src/pages/DocumentsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
  TextField,
  TablePagination
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LinkIcon from "@mui/icons-material/Link";

// File type icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TableChartIcon from "@mui/icons-material/TableChart";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import DescriptionIcon from "@mui/icons-material/Description";

import type { DocumentDTO } from "../api/documentApi";
import {
  fetchDocuments,
  uploadDocument,
  uploadUrl,
  ingestDocument,
} from "../api/documentApi";

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ingestingIds, setIngestingIds] = useState<number[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploadingUrl, setUploadingUrl] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);
  
  const [page, setPage] = useState(0);          // MUI uses 0-index
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [totalDocs, setTotalDocs] = useState(0);


  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarError(isError);
    setSnackbarOpen(true);
  };

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "application/json",
    "text/html",
  ];

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const data = await fetchDocuments(page + 1, rowsPerPage);
            setDocuments(data.items);
            setTotalDocs(data.total);
        } catch {
            showSnackbar("Failed to load documents", true);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

  useEffect(() => {
  void loadDocuments();
}, [page, rowsPerPage]);


  // ------------------------
  // FILE ICON HELPER
  // ------------------------
  const getFileIcon = (filename: string) => {
    const lower = filename.toLowerCase();

    if (lower.endsWith(".pdf")) return <PictureAsPdfIcon fontSize="small" color="error" />;
    if (lower.endsWith(".txt") || lower.endsWith(".md"))
      return <ArticleIcon fontSize="small" color="primary" />;
    if (lower.endsWith(".json"))
      return <InsertDriveFileIcon fontSize="small" color="info" />;
    if (lower.endsWith(".csv"))
      return <TableChartIcon fontSize="small" color="success" />;
    if (lower.endsWith(".docx"))
      return <TextSnippetIcon fontSize="small" color="secondary" />;

    return <DescriptionIcon fontSize="small" color="disabled" />;
  };

  // ------------------------
  // FILE UPLOAD
  // ------------------------
  const handleOpenUploadDialog = () => {
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      showSnackbar("Unsupported file type", true);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      await uploadDocument(selectedFile);
      showSnackbar("Document uploaded");
      handleCloseUploadDialog();
      await loadDocuments();
    } catch (err: any) {
      const message = err?.response?.data?.detail ?? "Failed to upload document";
      showSnackbar(message, true);
    } finally {
      setUploading(false);
    }
  };

  // ------------------------
  // URL UPLOAD
  // ------------------------
  const handleOpenUrlDialog = () => {
    setUrlInput("");
    setUrlDialogOpen(true);
  };

  const handleCloseUrlDialog = () => {
    setUrlInput("");
    setUrlDialogOpen(false);
  };

  const handleUploadUrl = async () => {
    if (!urlInput.trim()) {
      showSnackbar("URL cannot be empty", true);
      return;
    }

    if (!urlInput.startsWith("http")) {
      showSnackbar("URL must start with http or https", true);
      return;
    }

    setUploadingUrl(true);

    try {
      await uploadUrl(urlInput.trim());
      showSnackbar("URL added");
      handleCloseUrlDialog();
      await loadDocuments();
    } catch (err: any) {
      const message = err?.response?.data?.detail ?? "Failed to upload URL";
      showSnackbar(message, true);
    } finally {
      setUploadingUrl(false);
    }
  };

  // ------------------------
  // INGEST
  // ------------------------
  const handleIngest = async (id: number) => {
    setIngestingIds((prev) => [...prev, id]);

    try {
      await ingestDocument(id);
      showSnackbar("Ingestion started / completed");
      await loadDocuments();
    } catch {
      showSnackbar("Failed to ingest document", true);
    } finally {
      setIngestingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // ------------------------
  // RENDER
  // ------------------------
  const getStatusChip = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("ingest"))
      return <Chip label={status} color="warning" size="small" />;
    if (s.includes("uploaded")) return <Chip label={status} size="small" />;
    if (s.includes("ready") || s.includes("ingested"))
      return <Chip label={status} color="success" size="small" />;
    if (s.includes("fail"))
      return <Chip label={status} color="error" size="small" />;

    return <Chip label={status} size="small" />;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      {/* Header row */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload files or URLs and ingest them for RAG.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => void loadDocuments()} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>

          <Button variant="outlined" startIcon={<LinkIcon />} onClick={handleOpenUrlDialog}>
            Add URL
          </Button>

          <Button variant="contained" startIcon={<UploadFileIcon />} onClick={handleOpenUploadDialog}>
            Upload File
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name / URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {documents.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No documents yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {documents.map((doc) => {
              const isIngesting = ingestingIds.includes(doc.id);
              const status = doc.status.toLowerCase();

              return (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    {doc.filename?.startsWith("http") ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinkIcon fontSize="small" color="info" />
                        <a href={doc.filename} target="_blank" rel="noopener noreferrer">
                          {doc.filename}
                        </a>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getFileIcon(doc.filename)}
                        <Typography>{doc.original_filename ?? doc.filename}</Typography>
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>{getStatusChip(doc.status)}</TableCell>

                  <TableCell>{formatDate(doc.created_at)}</TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => void handleIngest(doc.id)}
                      disabled={
                        isIngesting ||
                        status.includes("ingested") ||
                        status.includes("ingesting")
                      }
                      startIcon={
                        isIngesting ? (
                          <CircularProgress size={14} />
                        ) : (
                          <PlayCircleOutlineIcon fontSize="small" />
                        )
                      }
                    >
                      {isIngesting
                        ? "Ingesting..."
                        : status.includes("ingested")
                        ? "Ingested"
                        : "Ingest"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {loading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalDocs}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>

      {/* File upload dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} fullWidth>
        <DialogTitle>Upload document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <input type="file" onChange={handleFileChange} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }} display="block">
              Supported: PDF, TXT, MD, DOCX, CSV, JSON, HTML
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseUploadDialog} disabled={uploading}>
            Cancel
          </Button>
          <Button variant="contained" disabled={!selectedFile || uploading} onClick={handleUpload}>
            {uploading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* URL upload dialog */}
      <Dialog open={urlDialogOpen} onClose={handleCloseUrlDialog} fullWidth>
        <DialogTitle>Add URL</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/article"
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseUrlDialog} disabled={uploadingUrl}>
            Cancel
          </Button>

          <Button variant="contained" disabled={uploadingUrl} onClick={handleUploadUrl}>
            {uploadingUrl ? <CircularProgress size={20} /> : "Add URL"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor: snackbarError ? "error.main" : "grey.900",
            color: "white",
          },
        }}
      />
    </Container>
  );
};

export default DocumentsPage;
