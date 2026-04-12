import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  Box, Typography, TextField, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Stack, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  IconButton, InputAdornment, Tooltip, Snackbar, Alert, Avatar
} from "@mui/material";

import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editVendor, setEditVendor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const loadVendors = async () => {
    try {
      const res = await API.get("/vendors");
      setVendors(res.data);
    } catch (err) {
      showMsg("Failed to load vendors", "error");
    }
  };

  useEffect(() => { loadVendors(); }, []);

  const showMsg = (message, severity = "success") => 
    setSnackbar({ open: true, message, severity });

  const approveVendor = async (id) => {
    try {
      await API.put(`/vendors/${id}/approve`);
      showMsg("Vendor approved successfully!");
      loadVendors();
    } catch (err) { showMsg("Approval failed", "error"); }
  };

  const deleteVendor = async (id) => {
    if (window.confirm("Are you sure you want to remove this vendor?")) {
      try {
        await API.delete(`/vendors/${id}`);
        showMsg("Vendor deleted successfully");
        loadVendors();
      } catch (err) {
        console.error("Delete failed:", err);
        showMsg("Delete failed — vendor may have linked records", "error");
      }
    }
  };

  const searchVendor = async () => {
    if (!searchId) return loadVendors();
    try {
      const res = await API.get(`/vendors/${searchId}`);
      setVendors(res.data ? [res.data] : []);
    } catch (err) { setVendors([]); }
  };

  const updateVendor = async () => {
    try {
      await API.put(`/vendors/${editVendor.id}`, editVendor);
      setEditVendor(null);
      showMsg("Vendor updated");
      loadVendors();
    } catch (err) { showMsg("Update failed", "error"); }
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        
<Paper 
  elevation={0} 
  sx={{ 
    p: 4, 
    mb: 4, 
    textAlign: 'center', 
    borderRadius: "12px", 
    border: "1px solid #e0e0e0",
    background: "linear-gradient(to right, #ffffff, #f8f9fa)", 
    borderLeft: "6px solid #1565c0" 
  }}
>
  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
    <HowToRegIcon sx={{ fontSize: 40, color: "#43a047" }} />
            Vendor Approval
  </Typography>
  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Verify and manage partnerships with external suppliers
  </Typography>
</Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 4, border: "1px solid #e0e0e0", borderRadius: "12px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search Vendor by ID..."
              size="small"
              fullWidth
              value={searchId}
              sx={{ border: "1px solid #000000"}}
              onChange={(e) => setSearchId(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
              }}
            />
            <Button variant="contained" onClick={searchVendor} sx={{ bgcolor: "#1976d2", px: 4 }}>
              SEARCH
            </Button>
            <IconButton onClick={loadVendors} sx={{ border: "1px solid #ccc", borderRadius: "4px" }}>
              <RestartAltIcon />
            </IconButton>
          </Stack>
        </Paper>

      
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: "12px", 
            border: "1px solid #e0e0e0", 
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
          }}
        >
          <Table>
            <TableHead 
              sx={{ 
                bgcolor: "#136acd", 
                "& .MuiTableCell-head": { 
                  color: "white", 
                  fontWeight: "bold", 
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)"
                } 
              }}
            >
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Contact Email</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.length > 0 ? vendors.map((v) => (
                <TableRow key={v.id} hover>
                  <TableCell sx={{ borderRight: "1px solid #eee", fontFamily: 'monospace' }}>#{v.id}</TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                        <BusinessIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{v.companyName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>{v.email}</TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>
                    <Chip 
                      label={v.approved ? "APPROVED" : "PENDING"} 
                      color={v.approved ? "success" : "warning"}
                      size="small"
                      icon={v.approved ? <VerifiedIcon /> : undefined}
                      sx={{ fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {!v.approved && (
                        <Tooltip title="Approve Vendor">
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="success" 
                            onClick={() => approveVendor(v.id)}
                            sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}
                          >
                            APPROVE
                          </Button>
                        </Tooltip>
                      )}
                      <IconButton size="small" color="primary" onClick={() => setEditVendor(v)}>
                        <EditIcon fontSize="small" /> Edit
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteVendor(v.id)}>
                        <DeleteIcon fontSize="small" /> Delete
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>No vendors awaiting approval.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>


      <Dialog open={!!editVendor} onClose={() => setEditVendor(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Update Vendor Details</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Company Name"
            margin="normal"
            value={editVendor?.companyName || ""}
            onChange={(e) => setEditVendor({ ...editVendor, companyName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Contact Email"
            margin="normal"
            value={editVendor?.email || ""}
            onChange={(e) => setEditVendor({ ...editVendor, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditVendor(null)}>Cancel</Button>
          <Button variant="contained" onClick={updateVendor} sx={{ bgcolor: "#1976d2" }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}