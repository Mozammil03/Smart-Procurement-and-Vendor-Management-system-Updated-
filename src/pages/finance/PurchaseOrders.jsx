import React, { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Stack, Container, TextField, InputAdornment, Chip
} from "@mui/material";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poId, setPoId] = useState("");

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await API.get("/po");
      setPurchaseOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchPO = async () => {
    try {
      if (!poId) return fetchPOs();
      const res = await API.get(`/po/${poId}`);
      setPurchaseOrders([res.data]);
    } catch (err) {
      console.error(err);
      alert("Purchase Order not found");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            Purchase Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage overall purchase orders
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ width: '400px' }}>
          <TextField
            fullWidth size="small" placeholder="Search PO ID..."
            value={poId} onChange={e => setPoId(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button variant="contained" onClick={searchPO} sx={{ bgcolor: "#1976d2", minWidth: '90px' }}>SEARCH</Button>
          <Button variant="outlined" onClick={fetchPOs} sx={{ minWidth: '40px', px: 1 }}><RestartAltIcon /></Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa",background:'#1976d2'}}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>PO NUMBER</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ORDER DATE</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>VENDOR EMAIL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.length > 0 ? purchaseOrders.map(po => (
              <TableRow key={po.id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{po.poNumber}</TableCell>
                <TableCell>{po.orderDate}</TableCell>
                <TableCell>
                  <Chip
                    label={po.status} size="small"
                    sx={{
                      fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem',
                      bgcolor: po.status === "COMPLETED" || po.status === "APPROVED" ? "#e8f5e9" : "#fff3e0",
                      color: po.status === "COMPLETED" || po.status === "APPROVED" ? "#2e7d32" : "#ef6c00"
                    }}
                  />
                </TableCell>
                <TableCell>{po.vendor?.email}</TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>No Purchase Orders found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}