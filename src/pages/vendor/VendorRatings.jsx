import { useEffect, useState, useMemo } from "react";
import { getVendorRatings } from "../../api/vendorService";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Chip,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";

export default function VendorRatings() {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const vendorId = localStorage.getItem("vendorId");

  useEffect(() => {
    if (!vendorId) {
      setError("Vendor identifier missing. Please login again to view your ratings.");
      setRatings([]);
      return;
    }

    setError("");
    getVendorRatings(vendorId)
      .then((res) => setRatings(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load ratings for this vendor.");
      });
  }, [vendorId]);

  const overallAvg = useMemo(() => {
    if (!ratings.length) return 0;
    const total = ratings.reduce((sum, r) => {
      const avg = (r.qualityScore + r.deliveryScore + r.priceScore) / 3;
      return sum + avg;
    }, 0);
    return (total / ratings.length).toFixed(1);
  }, [ratings]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <StarIcon sx={{ fontSize: 40, color: "#fbc02d" }} />
          Vendor Ratings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your performance and compliance scores
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Overall Avg: ${overallAvg} / 10`}
            sx={{ fontWeight: "bold", bgcolor: "#1976d2", color: "#fff" }}
          />
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}></TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                QUALITY
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                DELIVERY
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                PRICE
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                TYPE
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                DATE
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                COMMENTS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.length > 0 ? (
              ratings.map((r, i) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.qualityScore} / 10
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.deliveryScore} / 10
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.priceScore} / 10
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={r.isAdminRating ? "ADMIN" : "USER"}
                      size="small"
                      sx={{
                        bgcolor: r.isAdminRating ? "#e8f5e9" : "#fff3e0",
                        color: r.isAdminRating ? "#2e7d32" : "#ef6c00",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {r.ratedAt
                      ? new Date(r.ratedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{r.comments || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No Ratings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
