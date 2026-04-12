import { useState } from "react";
import { uploadDocument } from "../../api/vendorService";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, Snackbar, Alert
} from "@mui/material";

import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function UploadDocuments() {
  const [form, setForm] = useState({
    documentName: "",
    documentNumber: "",
    documentType: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const vendorId = localStorage.getItem("vendorId") || 1;

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error(err);
      showMsg("Failed to upload document", "error");
    }
  };

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

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}