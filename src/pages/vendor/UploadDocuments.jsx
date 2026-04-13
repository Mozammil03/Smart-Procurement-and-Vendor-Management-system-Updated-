import { useEffect, useState } from "react";
import { uploadDocument, getVendorDocuments, deleteVendorDocument } from "../../api/vendorService";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip
} from "@mui/material";

import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UploadDocuments() {
  const [form, setForm] = useState({
    documentName: "",
    documentNumber: "",
    documentType: ""
  });
  const [documents, setDocuments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const vendorId = Number(localStorage.getItem("vendorId") || 1);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadDocuments = async () => {
    try {
      const res = await getVendorDocuments({ vendorId });
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to load documents", err);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteVendorDocument(documentId);
      showMsg("Document deleted successfully");
      loadDocuments();
    } catch (err) {
      console.error(err);
      showMsg("Failed to delete document", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadDocument({
        ...form,
        vendorId: vendorId
      });
      showMsg("Document Uploaded Successfully!");
      setForm({ documentName: "", documentNumber: "", documentType: "" });
      loadDocuments();
    } catch (err) {
      console.error(err);
      showMsg("Failed to upload document", "error");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <FileUploadIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          Upload Documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep your vendor compliance documents up to date
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Document Name" required
                name="documentName" value={form.documentName} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Document Number" required
                name="documentNumber" value={form.documentNumber} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Document Type" required
                name="documentType" value={form.documentType} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ bgcolor: "#1976d2", fontWeight: 'bold', mt: 2 }}>
                UPLOAD
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: "12px", border: "1px solid #e0e0e0", background: "#fff" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1a237e" }}>
          Uploaded Documents
        </Typography>
        <Table>
          <TableHead sx={{ background: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Document Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Document Number</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Document Type</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Admin Comment</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.documentName || doc.documentNumber || doc.documentType || "-"}</TableCell>
                  <TableCell>{doc.documentNumber || doc.documentName || doc.documentType || "-"}</TableCell>
                  <TableCell>{doc.documentType || doc.documentName || doc.documentNumber || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status || "PENDING"}
                      size="small"
                      sx={{
                        bgcolor: doc.status === "ACCEPTED" ? "#e8f5e9" : doc.status === "REJECTED" ? "#ffe8e8" : "#e3f2fd",
                        color: doc.status === "ACCEPTED" ? "#2e7d32" : doc.status === "REJECTED" ? "#c62828" : "#1565c0",
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>{doc.adminComment || "-"}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#777" }}>
                  No uploaded documents yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}