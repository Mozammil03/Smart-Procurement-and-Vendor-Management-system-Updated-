import { useEffect, useState } from "react";
import { getVendorRatings } from "../../api/vendorService";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Container
} from "@mui/material";

import StarIcon from '@mui/icons-material/Star';

export default function VendorRatings() {
  const [ratings, setRatings] = useState([]);
  const vendorId = localStorage.getItem("vendorId") || 1;

  useEffect(() => {
    getVendorRatings(vendorId)
      .then(res => setRatings(res.data))
      .catch(err => console.error(err));
  }, [vendorId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
          <StarIcon sx={{ fontSize: 40, color: "#fbc02d" }} />
          Vendor Ratings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your performance and compliance scores
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>QUALITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DELIVERY</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>PRICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.length > 0 ? ratings.map(r => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{r.qualityScore} / 10</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{r.deliveryScore} / 10</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{r.priceScore} / 10</TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}>No Ratings found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}