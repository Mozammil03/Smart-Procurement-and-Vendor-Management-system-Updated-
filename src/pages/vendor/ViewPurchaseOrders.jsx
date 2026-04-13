import { useEffect, useState } from "react";
import { getVendorPOs } from "../../api/vendorService";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Container, Chip
} from "@mui/material";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ViewPurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }
    getVendorPOs(vendorId)
      .then(res => setOrders(res.data || []))
      .catch(err => {
        console.error("Failed to load purchase orders:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, color: "secondary.main" }} />
          Purchase Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all purchase orders assigned to you
        </Typography>
      </Box>

      {!vendorId ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: "12px", border: "1px solid #e0e0e0" }}>
          <Typography color="error" sx={{ fontWeight: 'bold' }}>
            Unable to load your purchase orders. Please log in again.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "background.paper" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>PO NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ORDER DATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
              ) : orders.length > 0 ? orders.map(po => (
              <TableRow key={po.id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{po.poNumber}</TableCell>
                <TableCell>{po.orderDate}</TableCell>
                <TableCell>
                  <Chip
                    label={po.status} size="small"
                    sx={{
                      fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem',
                      bgcolor: po.status === "COMPLETED" || po.status === "APPROVED" ? "#f3e5cf" : "#f7e1ca",
                      color: po.status === "COMPLETED" || po.status === "APPROVED" ? "#6e5135" : "#a87954"
                    }}
                  />
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}>No Purchase Orders found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}