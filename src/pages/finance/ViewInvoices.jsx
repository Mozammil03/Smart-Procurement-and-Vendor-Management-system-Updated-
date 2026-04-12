import React, { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Stack, Container, TextField, InputAdornment,
  Snackbar, Alert
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

export default function ViewInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoice");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchInvoice = async () => {
    try {
      if (!invoiceId) {
        fetchInvoices();
        return;
      }
      const res = await API.get(`/invoice/${invoiceId}`);
      setInvoices([res.data]);
    } catch (err) {
      showMsg("Invoice not found", "error");
    }
  };

  const processPayment = async (invId, amount) => {
    try {
      await API.post("/payment", {
        invoiceId: invId,
        paidAmount: amount,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMode: "BANK_TRANSFER",
        status: "PAID"
      });
      showMsg("Payment Successful", "success");
    } catch (err) {
      showMsg("Payment processing failed", "error");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReceiptIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            Invoices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and pay vendor invoices
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: '400px'}}>
          <TextField
            fullWidth size="small" placeholder="Search Invoice ID..."
            value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button variant="contained" onClick={searchInvoice} sx={{ bgcolor: "#1976d2", minWidth: '100px' }}>SEARCH</Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa",background:'#1976d2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>INVOICE ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>VENDOR</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length > 0 ? invoices.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell sx={{ fontFamily: 'monospace' }}>#{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.purchaseOrder?.vendor?.companyName}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>${inv.amount}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained" size="small"
                    startIcon={<PaymentIcon />}
                    onClick={() => processPayment(inv.id, inv.amount)}
                    sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                  >
                    PAY NOW
                  </Button>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>No invoices found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}