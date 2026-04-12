import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import api from "../../api/axios";

import {
  Box, Typography, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Card, CardContent, Grid, Button, Divider, 
  AppBar, Toolbar, Avatar, Container, Stack, Paper 
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InventoryIcon from '@mui/icons-material/Inventory'; 

const drawerWidth = 260;

export default function ManagerDashboard() {
  const [requisitions, setRequisitions] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [managerName, setManagerName] = useState("Manager"); 

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
   const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        
        const res = await api.get(`/users/${userId}`); 
        setManagerName(res.data.name || res.data.username);
      }
    } catch (err) {
      console.error("Could not fetch profile", err);
      setManagerName("Manager");
    }
  };

  fetchProfile();
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [req, app, po] = await Promise.all([
        api.get("/requisitions"),
        api.get("/approvals"),
        api.get("/po")
      ]);
      setRequisitions(req.data);
      setApprovals(app.data);
      setOrders(po.data);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = requisitions.filter(r => r.status === "PENDING").length;
  const approvedCount = approvals.filter(a => a.decision === "APPROVED").length;
  const poCount = orders.length;

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/manager" },
    { text: "Pending Approvals", icon: <PendingActionsIcon />, path: "/manager/pending" },
    { text: "Approved Requests", icon: <AssignmentTurnedInIcon />, path: "/manager/approved" },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7f6", minHeight: "100vh" }}>
      
  
      <AppBar position="fixed" elevation={0} sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "white",
        color: "#333",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a237e" }}>
            SMART <span style={{ color: "#555" }}>MANAGER</span>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <NotificationsIcon color="action" />
            <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Manager Portal</Typography>
            <Avatar sx={{ bgcolor: "#1a237e", width: 32, height: 32 }}>M</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "4px 0 10px rgba(0,0,0,0.02)"
          },
        }}
      >
        <Toolbar /> 
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', color: 'text.secondary' }}>Main Menu</Typography>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text} 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  "&.Mui-selected": { bgcolor: "rgba(26, 35, 126, 0.08)", color: "#1a237e" },
                  "&.Mui-selected .MuiListItemIcon-root": { color: "#1a237e" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 'auto', p: 1 }}>
            <Divider sx={{ mb: 2 }} />
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

    
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> 
        
        <Container maxWidth="lg">
        
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              textAlign: 'center', 
              borderRadius: "16px", 
              border: "1px solid #e0e0e0",
              background: "linear-gradient(to right, #ffffff, #f8f9fa)",
              borderLeft: "8px solid #1a237e" 
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              
              Welcome Back {managerName}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Here is what's happening with your procurement requests today.
            </Typography>
          </Paper>
            
        
          <Grid container spacing={3}>
            <StatCard 
              title="Pending Approvals" 
              count={pendingCount} 
              color="#ed6c02" 
              icon={<PendingActionsIcon sx={{ fontSize: 40, opacity: 0.3 }} />}
            />
            <StatCard 
              title="Approved Requests" 
              count={approvedCount} 
              color="#2e7d32" 
              icon={<AssignmentTurnedInIcon sx={{ fontSize: 40, opacity: 0.3 }} />}
            />
            <StatCard 
              title="Purchase Orders" 
              count={poCount} 
              color="#1a237e" 
              icon={<DashboardIcon sx={{ fontSize: 40, opacity: 0.3 }} />}
            />
          </Grid>

        
          <Box sx={{ mt: 4 }}>
            <Outlet />
          </Box>

        </Container>
      </Box>
    </Box>
  );
}


function StatCard({ title, count, color, icon }) {
  return (
    <Grid item xs={12} md={4}>
      <Card elevation={0} sx={{ 
        borderRadius: 4, 
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase' }}>
                {title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, color: "#333" }}>
                {count}
              </Typography>
            </Box>
            <Box sx={{ color: color }}>
              {icon}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}