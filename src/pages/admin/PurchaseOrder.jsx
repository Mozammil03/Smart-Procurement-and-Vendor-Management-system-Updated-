import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box, Typography, TextField, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Stack, Select, MenuItem,
  FormControl, InputLabel, Container, Grid, IconButton,
  Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert, InputAdornment, DialogContentText, Divider
} from "@mui/material";

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function PurchaseOrder() {
  const [reqs, setReqs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [poList, setPoList] = useState([]);
  const [search, setSearch] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewPO, setViewPO] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [form, setForm] = useState({
    requisitionId: "",
    vendorId: "",
    orderDate: "",
    expectedDelivery: "",
    totalAmount: "",
  });

  useEffect(() => { load(); }, []);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const load = async () => {
    try {
      const [r, v, p] = await Promise.all([
        api.get("/requisitions"),
        api.get("/vendors"),
        api.get("/po")
      ]);
      setReqs(r.data);
      setVendors(v.data);
      setPoList(p.data);
    } catch (err) { showMsg("Failed to sync data", "error"); }
  };

  const savePO = async (e) => {
    e.preventDefault();
    if (!form.vendorId || !form.requisitionId) {
      showMsg("Select Vendor and Requisition", "warning");
      return;
    }
    try {
      const params = new URLSearchParams({
        vendorId: form.vendorId,
        requisitionId: form.requisitionId,
      });
      if (form.totalAmount) params.append("totalAmount", form.totalAmount);
      await api.post(`/po?${params.toString()}`);
      showMsg("Purchase Order generated!");
      setForm({ requisitionId: "", vendorId: "", orderDate: "", expectedDelivery: "", totalAmount: "" });
      load();
    } catch (err) { showMsg("Error generating PO", "error"); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/po/${selectedId}`);
      setOpenDelete(false);
      load();
      showMsg("Order deleted");
    } catch (err) { showMsg("Delete failed", "error"); }
  };

  const searchPO = async () => {
    if (!search.trim()) return load();
    try {
      const res = await api.get(`/po/search?keyword=${encodeURIComponent(search)}`);
      setPoList(res.data);
    } catch (err) { showMsg("Search failed", "error"); }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") searchPO();
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">

        <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: "16px", border: "1px solid #e0e0e0", background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", borderLeft: "8px solid #1a237e" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <ReceiptLongIcon sx={{ fontSize: 40 }} /> Purchase Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">Manage procurement requests and official vendor orders</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "12px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth placeholder="Search PO Number or Vendor..." size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment> }}
            />
            <Button variant="contained" onClick={searchPO} sx={{ bgcolor: "#1a237e", px: 4, fontWeight: 'bold' }}>SEARCH</Button>
            <IconButton onClick={() => { setSearch(""); load(); }} sx={{ border: '1px solid #ccc', borderRadius: '4px' }}><RestartAltIcon /></IconButton>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon /> Generate New Purchase Order
          </Typography>

          <form onSubmit={savePO}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Step 1: Select Details
                </Typography>
                <Stack spacing={2.5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Requisition Reference</InputLabel>
                    <Select value={form.requisitionId} label="Requisition Reference" onChange={(e) => setForm({ ...form, requisitionId: e.target.value })}>
                      {reqs.map((r) => <MenuItem key={r.id} value={r.id}>Requisition #{r.id}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Assigned Vendor</InputLabel>
                    <Select value={form.vendorId} label="Assigned Vendor" onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
                      {vendors.map((v) => <MenuItem key={v.id} value={v.id}>{v.companyName}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Divider orientation="vertical" flexItem />
              </Grid>

              <Grid item xs={12} md={6.5}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Step 2: Logistics & Confirmation
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth type="date" label="Order Date" size="small" InputLabelProps={{ shrink: true }} value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth type="date" label="Exp. Delivery" size="small" InputLabelProps={{ shrink: true }} value={form.expectedDelivery} onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Total Estimated Amount" type="number" size="small" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" type="submit" size="large" sx={{ bgcolor: "#1a237e", fontWeight: 'bold', mt: 1 }}>
                      CONFIRM & CREATE OFFICIAL ORDER
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1a237e", "& .MuiTableCell-head": { color: "white", fontWeight: "bold" } }}>
              <TableRow>
                <TableCell>PO NO.</TableCell>
                <TableCell>VENDOR</TableCell>
                <TableCell>AMOUNT</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poList.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No purchase orders found.</TableCell></TableRow>
              ) : poList.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{p.poNumber}</TableCell>
                  <TableCell>{p.vendor?.companyName}</TableCell>
                  <TableCell sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                    {p.totalAmount != null ? `₹ ${parseFloat(p.totalAmount).toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell><Chip label={p.status || "CREATED"} size="small" sx={{ bgcolor: "#e8eaf6", color: "#1a237e", fontWeight: 'bold' }} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button variant="outlined" size="small" color="primary" onClick={() => setViewPO(p)}>VIEW</Button>
                      <Button variant="contained" size="small" color="error" onClick={() => { setSelectedId(p.id); setOpenDelete(true); }}>DELETE</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      {/* VIEW Dialog */}
      <Dialog open={!!viewPO} onClose={() => setViewPO(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1a237e' }}>Purchase Order Details</DialogTitle>
        <DialogContent dividers>
          {viewPO && (
            <Stack spacing={1.5}>
              <Box><Typography variant="caption" color="text.secondary">PO Number</Typography><Typography fontWeight="bold">{viewPO.poNumber}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Vendor</Typography><Typography fontWeight="bold">{viewPO.vendor?.companyName || "—"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Order Date</Typography><Typography>{viewPO.orderDate || "—"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Total Amount</Typography><Typography fontWeight="bold" color="#1a237e">{viewPO.totalAmount != null ? `₹ ${parseFloat(viewPO.totalAmount).toLocaleString()}` : "—"}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={viewPO.status || "CREATED"} size="small" sx={{ bgcolor: "#e8eaf6", color: "#1a237e", fontWeight: 'bold' }} /></Box>
              <Box><Typography variant="caption" color="text.secondary">Requisition ID</Typography><Typography>#{viewPO.requisition?.id || "—"}</Typography></Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewPO(null)} variant="contained" sx={{ bgcolor: "#1a237e" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Delete PO?</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete PO #{selectedId}?</DialogContentText></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
