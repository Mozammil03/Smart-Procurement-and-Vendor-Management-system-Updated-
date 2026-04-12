import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box, Typography, TextField, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Stack, Container, Grid,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert, InputAdornment, Chip, IconButton, Avatar,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,Card,CardContent 
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';


const drawerWidth = 260;

export default function MyRequisitions() {
  const [data, setData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editForm, setEditForm] = useState({ quantity: "", reason: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { load(); }, []);

  const showMsg = (message, severity = "success") => 
    setSnackbar({ open: true, message, severity });

  const load = async () => {
    try {
      const res = await api.get("/requisitions");
      setData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      setData([]);
      showMsg("Failed to load records", "error");
    }
  };

  const search = async () => {
    if (!searchId) return load();
    try {
      const res = await api.get(`/requisitions/${searchId}`);
      setData(res.data ? [res.data] : []);
    } catch (err) {
      showMsg("Requisition not found", "error");
      setData([]);
    }
  };

  const viewById = async (id) => {
    try {
      const res = await api.get(`/requisitions/${id}`);
      setSelected(res.data);
      setEditForm({
        quantity: res.data.quantity,
        reason: res.data.reason,
      });
      setOpen(true);
      setEdit(false);
    } catch (err) { showMsg("Error fetching details", "error"); }
  };

  const updateReq = async () => {
    try {
      await api.put(`/requisitions/${selected.id}`, {
        quantity: Number(editForm.quantity),
        reason: editForm.reason,
      });
      showMsg("Requisition updated successfully");
      setOpen(false);
      load();
    } catch (err) { showMsg("Update failed", "error"); }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
    { text: "Create Requisition", icon: <ListAltIcon />, path: "/employee/create-requisition" },
    { text: "My Requisitions", icon: <InventoryIcon />, path: "/employee/my-requisitions" },
    { text: "Track Status", icon: <CategoryIcon />, path: "/employee/track-status" }
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      
  
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", borderRight: "1px solid #eee" } }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#1976d2" }}>SMART <span style={{ color: "#333" }}>EMP</span></Typography>
        </Box>
        <Divider variant="middle" sx={{ mb: 2 }} />
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} onClick={() => navigate(item.path)} selected={location.pathname === item.path} sx={{ borderRadius: "8px", mb: 1, py: 1.5, "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)", color: "#1a237e" } }}>
              <ListItemIcon sx={{ minWidth: 45 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 3 }}><Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={() => { localStorage.clear(); navigate("/"); }} sx={{ borderRadius: "8px", fontWeight: 800 }}>LOGOUT</Button></Box>
      </Drawer>

      
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          
      
          <Card elevation={0} sx={{ mb: 4, borderRadius: "16px", border: "1px solid #e0e0e0", borderTop: "6px solid #1976d2" }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", color: "#1976d2", width: 60, height: 60 }}>
                  <HistoryEduIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#333" }}>My Requisitions</Typography>
                  <Typography variant="body1" color="text.secondary">Review and manage your submitted supply requests.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          
          <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "12px" }}>
            <Stack direction="row" spacing={2}>
              <TextField fullWidth placeholder="Search by Requisition ID..." size="small" value={searchId} onChange={e => setSearchId(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
              <Button variant="contained" onClick={search} sx={{ bgcolor: "#1976d2", px: 4 }}>SEARCH</Button>
              <IconButton onClick={load} sx={{ border: "1px solid #ccc", borderRadius: "4px" }}><RestartAltIcon /></IconButton>
            </Stack>
          </Paper>

      
          <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#1976d2", "& .MuiTableCell-head": { color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" } }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? data.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ borderRight: "1px solid #eee", color: "#666" }}>#{r.id}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #eee", fontWeight: 700 }}>{r.item?.itemName}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #eee" }}>{r.quantity}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #eee" }}>
                      <Chip label={r.status} size="small" sx={{ 
                        fontWeight: 800, fontSize: '0.7rem', borderRadius: '6px',
                        bgcolor: r.status === "PENDING" ? "#fff3e0" : r.status === "APPROVED" ? "#e8f5e9" : "#ffebee",
                        color: r.status === "PENDING" ? "#ef6c00" : r.status === "APPROVED" ? "#2e7d32" : "#d32f2f"
                      }} />
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" size="small" startIcon={<VisibilityIcon fontSize="inherit"/>} onClick={() => viewById(r.id)} sx={{ bgcolor: '#1976d2', fontSize: '0.7rem' }}>
                        VIEW
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>No requisitions found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>

      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>
          {edit ? "Edit Requisition" : "Requisition Details"}
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">REQ ID</Typography><Typography variant="body1" fontWeight="bold">#{selected.id}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">ITEM</Typography><Typography variant="body1" fontWeight="bold">{selected.item?.itemName}</Typography></Grid>
                <Grid item xs={12}><Divider /></Grid>
              </Grid>

              {edit ? (
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <TextField label="Quantity" type="number" fullWidth value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} />
                  <TextField label="Reason" multiline rows={3} fullWidth value={editForm.reason} onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })} />
                </Stack>
              ) : (
                <Stack spacing={2}>
                   <Box><Typography variant="caption" color="text.secondary">STATUS</Typography><br/><Chip label={selected.status} size="small" color="primary" sx={{ fontWeight: 'bold' }}/></Box>
                   <Box><Typography variant="caption" color="text.secondary">QUANTITY</Typography><Typography variant="body1">{selected.quantity}</Typography></Box>
                   <Box><Typography variant="caption" color="text.secondary">REASON</Typography><Typography variant="body1">{selected.reason}</Typography></Box>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Button onClick={() => setOpen(false)} color="inherit">Close</Button>
          {edit ? (
            <Button onClick={updateReq} variant="contained" color="primary">Save Changes</Button>
          ) : (
            selected?.status === "PENDING" && <Button onClick={() => setEdit(true)} variant="contained" startIcon={<EditIcon />}>Edit Request</Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}