import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Box, Typography, TextField, Button, Paper, Grid, Table, TableHead,
  TableRow, TableCell, TableBody, Card, CardContent, Chip, Stack,
  Container, Divider, Drawer, List, ListItemButton, ListItemIcon, 
  ListItemText, Avatar, IconButton, InputAdornment
} from "@mui/material";


import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';


const drawerWidth = 260;

export default function TrackStatus() {
  const [reqs, setReqs] = useState([]);
  const [id, setId] = useState("");
  const [approval, setApproval] = useState([]);
  const [po, setPo] = useState([]);
  const [delivery, setDelivery] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/requisitions");
      setReqs(res.data);
    } catch (err) { console.error(err); }
  };

  const track = async (trackId) => {
    const resolvedId = trackId || id;
    if (!resolvedId) return;
    try {
      const approvalRes = await api.get(`/approvals`);
      const filtered = approvalRes.data.filter(
        a => a.requisition?.id == resolvedId
      );
      setApproval(filtered);

      const poRes = await api.get(`/po/requisition/${resolvedId}`);
      setPo(poRes.data || []);

      const delRes = await api.get(`/api/deliveries/requisition/${resolvedId}`);
      setDelivery(delRes.data || []);
    } catch (err) {
      console.error("Track error:", err);
      setApproval([]); setPo([]); setDelivery([]);
    }
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
          
    
          <Card elevation={0} sx={{ mb: 4, borderRadius: 4, border: "1px solid #e0e0e0", borderTop: "6px solid #1976d2", textAlign: 'center' }}>
            <CardContent sx={{ py: 3 }}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", color: "#1976d2", width: 50, height: 50, mb: 1 }}>
                  <TrackChangesIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Track Procurement Status</Typography>
                <Typography variant="body2" color="text.secondary">Enter a Requisition ID to see the live workflow progress.</Typography>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={4}>
        
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Recent Requisitions</Typography>
              <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#2833bf", "& .MuiTableCell-head": { color: "white", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reqs.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>#{r.id}</TableCell>
                        <TableCell>
                          <Chip label={r.status} size="small" sx={{ 
                            fontWeight: 800, fontSize: '0.65rem',
                            bgcolor: r.status === "APPROVED" ? "#e8f5e9" : "#fff3e0",
                            color: r.status === "APPROVED" ? "#2e7d32" : "#ef6c00"
                          }} />
                        </TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" onClick={() => { setId(r.id); track(r.id); }}>TRACK</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "12px" }}>
                <Stack direction="row" spacing={1}>
                  <TextField fullWidth size="small" placeholder="Enter ID to track..." value={id} onChange={(e) => setId(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
                  <Button variant="contained" onClick={() => track()} sx={{ bgcolor: "#1976d2" }}>TRACK</Button>
                </Stack>
              </Paper>

          
              <Stack spacing={2}>
              
                <StatusStep icon={<VerifiedUserIcon />} title="Management Approval" color={approval.length > 0 ? "#2e7d32" : "#ccc"}>
                  {approval.length > 0 ? (
                    approval.map((a, i) => (
                <Typography variant="body2" key={i}>
                 Approved by: <b>{a.managerName ? a.managerName : "Manager"}</b> ({a.decision})
                </Typography>                    ))
                  ) : "Waiting for manager review..."}
                </StatusStep>

            
                <StatusStep icon={<ReceiptIcon />} title="Purchase Order Generated" color={po.length > 0 ? "#1976d2" : "#ccc"}>
                  {po.length > 0 ? (
                    po.map((p, i) => (
                      <Typography variant="body2" key={i}>PO Number: <b>{p.poNumber || `#${p.id}`}</b></Typography>
                    ))
                  ) : "Pending PO creation..."}
                </StatusStep>

              
                <StatusStep icon={<LocalShippingIcon />} title="Delivery & Dispatch" color={delivery.length > 0 ? "#ed6c02" : "#ccc"}>
                  {delivery.length > 0 ? (
                    delivery.map((d, i) => (
                      <Typography variant="body2" key={i}>Tracking: <b>{d.trackingNumber}</b> | Status: {d.deliveryStatus}</Typography>
                    ))
                  ) : "Awaiting dispatch from vendor..."}
                </StatusStep>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function StatusStep({ icon, title, color, children }) {
  return (
    <Card elevation={0} sx={{ border: `1px solid ${color}`, borderLeft: `8px solid ${color}`, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ color: color }}>{icon}</Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: color }}>{title}</Typography>
            <Typography variant="caption" color="text.secondary">{children}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}