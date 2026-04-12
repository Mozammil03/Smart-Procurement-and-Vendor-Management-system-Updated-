import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Button, Avatar
} from "@mui/material";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function VendorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { text: "Purchase Orders", icon: <ShoppingCartIcon />, path: "/vendor/purchase-orders" },
    { text: "Delivery Tracking", icon: <LocalShippingIcon />, path: "/vendor/delivery" },
    { text: "Submit Invoice", icon: <ReceiptIcon />, path: "/vendor/submit-invoice" },
    { text: "Upload Documents", icon: <FileUploadIcon />, path: "/vendor/upload-documents" },
    { text: "Vendor Ratings", icon: <StarIcon />, path: "/vendor/ratings" },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7f6", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            SMART <span style={{ color: '#333' }}>VENDOR</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Welcome, <b>Vendor Portal</b></Typography>
            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>V</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", border: 'none', boxShadow: '2px 0 10px rgba(0,0,0,0.05)' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List sx={{ pt: 2 }}>
            <Typography variant="overline" sx={{ px: 3, fontWeight: 'bold', color: 'text.secondary' }}>Vendor Menu</Typography>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path || (location.pathname === '/vendor' && item.path === '/vendor/purchase-orders')}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: (location.pathname === item.path || (location.pathname === '/vendor' && item.path === '/vendor/purchase-orders')) ? '#1976d2' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 'auto', p: 2 }}>
            <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}