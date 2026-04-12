import React, { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, MenuItem, Snackbar, Alert, FormControl,
  InputLabel, Select, Autocomplete
} from "@mui/material";

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function ProcessPayment() {
  const [invoiceId, setInvoiceId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [status, setStatus] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    API.get("/invoice").then(res => setInvoices(res.data)).catch(() => {});
  }, []);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceId || !paidAmount || !paymentDate || !paymentMode || !status) {
      showMsg("Please fill in all fields", "warning");
      return;
    }
    try {
      await API.post("/payment", {
        invoiceId: Number(invoiceId),
        paidAmount: Number(paidAmount),
        paymentDate,
        paymentMode,
        status,
      });
      showMsg("Payment Processed Successfully!");
      setInvoiceId(""); setPaidAmount(""); setPaymentDate(""); setPaymentMode(""); setStatus("");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to process payment — check Invoice ID";
      showMsg(msg, "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          Process Payment
        </Typography>
        <Typography variant="body1" color="text.secondary">Record a new payment transaction against an invoice</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Invoice</InputLabel>
                <Select value={invoiceId} label="Invoice" onChange={e => setInvoiceId(e.target.value)}>
                  {invoices.length > 0
                    ? invoices.map(inv => (
                        <MenuItem key={inv.id} value={inv.id}>
                          #{inv.id} — {inv.invoiceNumber} (₹{inv.amount})
                        </MenuItem>
                      ))
                    : <MenuItem disabled>No invoices found</MenuItem>
                  }
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Or type Invoice ID manually:
              </Typography>
              <TextField
                fullWidth size="small" type="number" placeholder="Invoice ID"
                value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
                sx={{ mt: 0.5 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Paid Amount (₹)" type="number" required
                value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Payment Date" type="date" required
                InputLabelProps={{ shrink: true }}
                value={paymentDate} onChange={e => setPaymentDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Mode</InputLabel>
                <Select value={paymentMode} label="Payment Mode" onChange={e => setPaymentMode(e.target.value)}>
                  <MenuItem value="CASH_TRANSFER">Cash Transfer</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Payment Status</InputLabel>
                <Select value={status} label="Payment Status" onChange={e => setStatus(e.target.value)}>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ bgcolor: "#1976d2", fontWeight: 'bold', mt: 2 }}>
                PROCESS PAYMENT
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
