import React, { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Stack, Container, TextField, InputAdornment,
  Chip
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function ViewPayments() {
  const [payments, setPayments] = useState([]);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    API.get("/payment")
      .then(res => setPayments(res.data))
      .catch(err => console.error(err));
  };

  const searchPayment = async () => {
    try {
      if (!paymentId) return load();
      const res = await API.get(`/payment/${paymentId}`);
      setPayments([res.data]);
    } catch (err) {
      console.error(err);
      alert("Payment not found");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
            <PaymentIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            Payment History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View completed and pending vendor payments
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ width: '400px' }}>
          <TextField
            fullWidth size="small" placeholder="Search Payment ID..."
            value={paymentId} onChange={e => setPaymentId(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button variant="contained" onClick={searchPayment} sx={{ bgcolor: "#1976d2", minWidth: '90px' }}>SEARCH</Button>
          <Button variant="outlined" onClick={load} sx={{ minWidth: '40px', px: 1 }}><RestartAltIcon /></Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa",background:'#1976d2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>INVOICE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>VENDOR</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? payments.map((pay) => (
              <TableRow key={pay.id} hover>
                <TableCell sx={{ fontFamily: 'monospace' }}>#{pay.id}</TableCell>
                <TableCell>#{pay.invoice?.invoiceNumber}</TableCell>
                <TableCell>{pay.invoice?.purchaseOrder?.vendor?.companyName}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>${pay.paidAmount}</TableCell>
                <TableCell>{pay.paymentDate}</TableCell>
                <TableCell>
                  <Chip
                    label={pay.status} size="small"
                    sx={{
                      fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem',
                      bgcolor: pay.status === "PAID" || pay.status === "COMPLETED" ? "#e8f5e9" : "#fff3e0",
                      color: pay.status === "PAID" || pay.status === "COMPLETED" ? "#2e7d32" : "#ef6c00"
                    }}
                  />
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No payments found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}