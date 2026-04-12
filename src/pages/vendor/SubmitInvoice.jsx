import { useState } from "react";
import { submitInvoice } from "../../api/vendorService";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, Snackbar, Alert
} from "@mui/material";

import ReceiptIcon from '@mui/icons-material/Receipt';

export default function SubmitInvoice() {
  const [form, setForm] = useState({
    poId: "",
    invoiceNumber: "",
    amount: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInvoice({
        purchaseOrder: { id: form.poId },
        invoiceNumber: form.invoiceNumber,
        amount: form.amount
      });
      showMsg("Invoice Submitted Successfully!");
      setForm({ poId: "", invoiceNumber: "", amount: "" });
    } catch (err) {
      console.error(err);
      showMsg("Failed to submit invoice", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <ReceiptIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          Submit Invoice
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Request payment for completed purchase orders
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Invoice Number" type="number" required
                name="poId" value={form.poId} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Purchase Order ID" required
                name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth label="Amount" type="number" required
                name="amount" value={form.amount} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ bgcolor: "#1976d2", fontWeight: 'bold', mt: 2 }}>
                SUBMIT INVOICE
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