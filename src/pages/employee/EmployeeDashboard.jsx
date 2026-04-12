import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Grid, Card, CardContent, Container, Stack, Divider,
  Avatar, Chip, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Button
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

export default function EmployeeDashboard() {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [reqs, setReqs] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [i, inv, r] = await Promise.all([
        api.get("/items"),
        api.get("/inventory"),
        api.get("/requisitions")
      ]);
      setItems(i.data);
      setInventory(inv.data);
      setReqs(r.data);
    } catch (err) { console.error("Load failed", err); }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
    { text: "Create Requisition", icon: <ListAltIcon />, path: "/employee/create-requisition" },
    { text: "My Requisitions", icon: <InventoryIcon />, path: "/employee/my-requisitions" },
    { text: "Track Status", icon: <CategoryIcon />, path: "/employee/track-status" }
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7f6", minHeight: "100vh" }}>
      
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
          
          <Card elevation={0} sx={{ 
            mb: 4, 
            borderRadius: 3, 
            border: "1px solid #e0e0e0", 
            borderTop: "6px solid #1976d2" 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#333" }}>
                    Welcome Back, Employee
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Access inventory and manage your procurement requisitions.
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                  <AccountCircleIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>

    
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <StatCard title="Total Items" count={items.length} color="#1976d2" icon={<CategoryIcon />} />
            <StatCard title="Inventory Records" count={inventory.length} color="#2e7d32" icon={<WarehouseIcon />} />
            <StatCard title="My Requests" count={reqs.length} color="#ed6c02" icon={<ListAltIcon />} />
          </Grid>

        
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Available Items Catalogue</Typography>
              <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#1976d2", "& .MuiTableCell-head": { color: "white", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((i) => (
                      <TableRow key={i.id} hover>
                        <TableCell sx={{ borderRight: "1px solid #eee" }}>#{i.id}</TableCell>
                        <TableCell sx={{ borderRight: "1px solid #eee", fontWeight: 600 }}>{i.itemName}</TableCell>
                        <TableCell><Chip label={i.category} size="small" variant="outlined" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Live Stock Levels</Typography>
              <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#1976d2", "& .MuiTableCell-head": { color: "white", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{inv.item?.itemName}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={inv.quantityAvailable} 
                            size="small" 
                            sx={{ 
                                fontWeight: 'bold', 
                                bgcolor: inv.quantityAvailable < 5 ? "#ffebee" : "#e8f5e9",
                                color: inv.quantityAvailable < 5 ? "#d32f2f" : "#2e7d32"
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function StatCard({ title, count, color, icon }) {
  return (
    <Grid item xs={12} md={4}>
      <Card elevation={0} sx={{ borderRadius: 3, borderLeft: `6px solid ${color}`, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{title}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>{count}</Typography>
            </Box>
            <Box sx={{ color: color, opacity: 0.5 }}>{icon}</Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}