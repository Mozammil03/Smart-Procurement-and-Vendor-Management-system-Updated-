import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getAdminVendorRatings, createAdminVendorRating, deleteVendorRatings } from "../../api/vendorService";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box, Container, Paper, Typography, Grid, TextField, MenuItem,
  Button, Table, TableHead, TableRow, TableCell, TableBody,
  Snackbar, Alert, Stack,
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

export default function AdminVendorRatings() {
  const [vendors, setVendors] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [form, setForm] = useState({
    vendorId: "",
    qualityScore: 8,
    deliveryScore: 8,
    priceScore: 8,
    comments: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadVendors = async () => {
    try {
      const res = await API.get("/vendors");
      setVendors(res.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load vendors", severity: "error" });
    }
  };

  const loadRatings = async () => {
    try {
      const res = await getAdminVendorRatings();
      setRatings(res.data || []);
    } catch (err) {
      console.error('Error loading admin ratings:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      setSnackbar({
        open: true,
        message: "Failed to load vendor ratings. Backend API may not be implemented yet.",
        severity: "warning"
      });
      setRatings([]);
    }
  };

  useEffect(() => {
    loadVendors();
    loadRatings();
  }, []);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const getAvgRatingColor = (avg) => {
    const numericAvg = Number(avg);
    const ratio = Math.max(0, Math.min(1, (numericAvg - 1) / 9));
    const hue = ratio * 120;
    return `hsl(${hue}, 75%, 92%)`;
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!form.vendorId) return showMsg("Please select a vendor.", "warning");

    const vendorIdNum = Number(form.vendorId);
    if (!Number.isFinite(vendorIdNum) || vendorIdNum <= 0) {
      return showMsg("Selected vendor is invalid. Please choose a valid vendor.", "error");
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      return showMsg(
        "Admin user ID missing in local storage. Please log in again.",
        "error",
      );
    }

    const userIdNum = Number(userId);
    if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
      return showMsg(
        "Stored admin user ID is invalid. Please log in again.",
        "error",
      );
    }

    const payload = {
      vendorId: vendorIdNum,
      ratedByUserId: userIdNum,
      qualityScore: Number(form.qualityScore),
      deliveryScore: Number(form.deliveryScore),
      priceScore: Number(form.priceScore),
      comments: form.comments || "",
      isAdminRating: true,
    };

    console.debug("Submitting admin vendor rating payload:", payload);

    try {
      await createAdminVendorRating(payload);
      showMsg("Admin rating submitted successfully.", "success");
      setForm({
        vendorId: "",
        qualityScore: 8,
        deliveryScore: 8,
        priceScore: 8,
        comments: "",
      });
      loadRatings();
      loadVendors();
    } catch (err) {
      console.error("Error submitting rating:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        showMsg(
          `Failed to submit rating: ${err.response.data?.error || "Server error"}`,
          "error",
        );
      } else {
        showMsg(
          "Failed to submit rating. Backend API may not be implemented yet.",
          "error",
        );
      }
    }
  };

  const deleteRating = async (e) => {
    e.preventDefault();
    if (!form.vendorId) return showMsg("Please select a vendor.", "warning");

    try {
      await loadRatings();
      if (ratings.length === 0) {
        showMsg("No ratings available", "error");
        return;
      }
      let count = 0;
      ratings.forEach(element => {
        if (element.vendor?.id === Number(form.vendorId)) {
          count++;
        }
      });
      if (ratings.length === 0 || count === 0) {
        showMsg(`Selected vendor has no rating`, "error");
        return;
      }
      await deleteVendorRatings(Number(form.vendorId));
      showMsg("Vendor rating deleted successfully.", "success");
      setForm({
        vendorId: "",
        qualityScore: 8,
        deliveryScore: 8,
        priceScore: 8,
        comments: "",
      });
      loadRatings();
      loadVendors();
    } catch (err) {
      console.error("Error deleting rating:", err);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            background: "linear-gradient(to right, #ffffff, #f8f9fa)",
            borderLeft: "6px solid #1976d2",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1a237e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <StarIcon sx={{ fontSize: 40, color: "#fbc02d" }} />
            Vendor Ratings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Create and review official admin ratings for vendor performance.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Rate Vendors
          </Typography>

          <form onSubmit={submitRating}>
            <Grid
              container
              spacing={2}
              sx={{
                minWidth: "50px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Vendor"
                    fullWidth
                    sx={{ minWidth: "200px" }}
                    value={form.vendorId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, vendorId: e.target.value }))
                    }
                    required
                  >
                    <MenuItem value="">Select vendor</MenuItem>
                    {vendors.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name || `Vendor ${v.id}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    label="Quality Score"
                    type="number"
                    fullWidth
                    sx={{ minWidth: "120px" }}
                    inputProps={{ min: 0, max: 10 }}
                    value={form.qualityScore}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        qualityScore: Math.max(
                          0,
                          Math.min(10, Number(e.target.value)),
                        ),
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Delivery Score"
                    type="number"
                    fullWidth
                    sx={{ minWidth: "120px" }}
                    inputProps={{ min: 0, max: 10 }}
                    value={form.deliveryScore}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        deliveryScore: Math.max(
                          0,
                          Math.min(10, Number(e.target.value)),
                        ),
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Price Score"
                    type="number"
                    sx={{ minWidth: "120px" }}
                    fullWidth
                    inputProps={{ min: 0, max: 10 }}
                    value={form.priceScore}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priceScore: Math.max(
                          0,
                          Math.min(10, Number(e.target.value)),
                        ),
                      }))
                    }
                    required
                  />
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "start",
                  width: "100%",
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    label="Comments"
                    value={form.comments}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, comments: e.target.value }))
                    }
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ bgcolor: "#1976d2" }}
                    >
                      Submit Rating
                    </Button>
                  </Stack>
                </Grid>
              </div>
            </Grid>
          </form>
        </Paper>

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
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow sx={{ bgcolor: "#1976d2" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  VENDOR
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  COMPANY
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  QUALITY
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  DELIVERY
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  PRICE
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  AVERAGE
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  RATED BY
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  DATE
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                  COMMENTS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratings.length > 0 ? (
                ratings.map((r) => {
                  const avg = (
                    (r.qualityScore + r.deliveryScore + r.priceScore) /
                    3
                  ).toFixed(2);
                  return (
                    <TableRow
                      key={r.id}
                      hover
                      sx={{ backgroundColor: getAvgRatingColor(avg) }}
                    >
                      <TableCell>
                        {r.vendor?.name || `Vendor ${r.vendor?.id}`}
                      </TableCell>
                      <TableCell>
                        {r.vendor?.companyName || `Vendor ${r.vendor?.id}`}
                      </TableCell>
                      <TableCell>{r.qualityScore}/10</TableCell>
                      <TableCell>{r.deliveryScore}/10</TableCell>
                      <TableCell>{r.priceScore}/10</TableCell>
                      <TableCell>{avg}</TableCell>
                      <TableCell>
                        {r.ratedBy?.username || r.ratedBy?.email || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {new Date(r.ratedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{r.comments || "-"}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    No admin ratings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Paper
          sx={{
            width: "fit-content",
            padding: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            placeItems: "center",
            marginTop: "30px",
            borderRadius: "12px",
          }}
        >
          <form onSubmit={deleteRating}>
            <div>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Delete Vendor Ratings
              </Typography>
              <Grid item xs={12} md={2}>
                <TextField
                  select
                  label="Vendor"
                  sx={{ width: "200px" }}
                  value={form.vendorId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, vendorId: e.target.value }))
                  }
                  required
                >
                  <MenuItem value="">Select vendor</MenuItem>
                  {vendors.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name || `Vendor ${v.id}`}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#fa0060",
                    marginLeft: "20px",
                    height: "55px",
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </div>
          </form>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
