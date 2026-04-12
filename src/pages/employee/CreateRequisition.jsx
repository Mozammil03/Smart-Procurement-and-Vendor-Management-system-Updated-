import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box, Typography, TextField, Button, Paper, Stack, Select, 
  MenuItem, Container, Card, CardContent, FormControl, 
  InputLabel, InputAdornment, Snackbar, Alert, Avatar,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider

} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';


const drawerWidth = 260;

export default function CreateRequisition() {
  const [items, setItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    userId: 1,
    itemId: "",
    quantity: "",
    reason: "",
  });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  const showMsg = (message, severity = "success") => 
    setSnackbar({ open: true, message, severity });

  const submit = async () => {
    if (!form.itemId || !form.quantity || !form.reason) {
      showMsg("Please fill in all fields", "warning");
      return;
    }
    try {
      const payload = {
        userId: Number(form.userId),
        itemId: Number(form.itemId),
        quantity: Number(form.quantity),
        reason: form.reason,
        item: { id: Number(form.itemId) },
      };
      await api.post("/requisitions", payload);
      showMsg("Requisition Created Successfully!");
      setForm({ userId: 1, itemId: "", quantity: "", reason: "" });
    } catch (err) { showMsg("Error creating requisition", "error"); }
  };

  
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
    { text: "Create Requisition", icon: <ListAltIcon />, path: "/employee/create-requisition" },
    { text: "My Requisitions", icon: <InventoryIcon />, path: "/employee/my-requisitions" },
    { text: "Track Status", icon: <CategoryIcon />, path: "/employee/track-status" }
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7f6", minHeight: "100vh" }}>
      

       {/* <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1976d2", mb: 1 }}>
            SMART <span style={{ color: "#333" }}>EMP</span>
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  "&.Mui-selected": { bgcolor: "rgba(25(118,210, 0.08)", color: "#1976d2" },
                  "&.Mui-selected .MuiListItemIcon-root": { color: "#1976d2" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button 
            fullWidth variant="outlined" color="error" 
            startIcon={<LogoutIcon />} 
            onClick={() => { localStorage.clear(); navigate("/"); }}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </Drawer> */}


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
        <Container maxWidth="md">
          
          <Card elevation={0} sx={{ 
            mb: 4, 
            borderRadius: 4, 
            border: "1px solid #e0e0e0", 
            borderTop: "6px solid #1976d2",
            textAlign: 'center'
          }}>
            <CardContent sx={{ py: 3 }}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", color: "#1976d2", width: 56, height: 56, mb: 1 }}>
                  <AddCircleOutlineIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#333" }}>
                  Create New Requisition
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill out the form below to request new items from inventory.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Select Item</InputLabel>
                <Select
                  value={form.itemId}
                  label="Select Item"
                  onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                  startAdornment={<InputAdornment position="start"><InventoryIcon color="action" sx={{ mr: 1 }} /></InputAdornment>}
                >
                  {items.map((i) => <MenuItem key={i.id} value={i.id}>{i.itemName}</MenuItem>)}
                </Select>
              </FormControl>

              <TextField
                label="Required Quantity"
                type="number"
                fullWidth
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment> }}
              />

              <TextField
                label="Reason for Request"
                multiline
                rows={4}
                fullWidth
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescriptionIcon color="action" /></InputAdornment> }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={submit}
                startIcon={<SendIcon />}
                sx={{ bgcolor: "#1976d2", py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
              >
                SUBMIT REQUISITION
              </Button>
            </Stack>
          </Paper>
        </Container>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}