import { useState } from "react";
import { createDelivery } from "../../api/vendorService";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, MenuItem, Snackbar, Alert
} from "@mui/material";

import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Delivery() {
  // const [form, setForm] = useState({
  //   purchaseOrderId: "",
  //   deliveryDate: "",
  //   status: "DELIVERED"
  // });

  const [form, setForm] = useState({
  purchaseOrderId: "",
  trackingNumber: "",
  status: "DELIVERED"
});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
  purchaseOrderId: form.purchaseOrderId,
  trackingNumber: form.trackingNumber,
  deliveryStatus: form.status
};
      await createDelivery(payload);
      showMsg("Delivery Tracker Updated Successfully!");
      setForm({ purchaseOrderId: "", deliveryDate: "", status: "DELIVERED" });
    } catch (err) {
      console.error(err);
      showMsg("Failed to update delivery", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <LocalShippingIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          Delivery Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update the delivery status of your purchase orders
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <form onSubmit={submit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Purchase Order ID" type="number" required
                name="purchaseOrderId" value={form.purchaseOrderId} onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Delivery Date" type="date" required InputLabelProps={{ shrink: true }}
                name="deliveryDate" value={form.deliveryDate} onChange={handleChange}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Tracking Number" required
                name="trackingNumber" value={form.trackingNumber} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Status" select required
                name="status" value={form.status} onChange={handleChange}
              >
                <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                <MenuItem value="IN_TRANSIT">IN TRANSIT</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ bgcolor: "#1976d2", fontWeight: 'bold', mt: 2 }}>
                SUBMIT DELIVERY
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