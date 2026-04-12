import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Button, Avatar, Stack
} from "@mui/material";

import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { text: "Invoices", icon: <ReceiptIcon />, path: "/finance/invoices" },
    { text: "Payment History", icon: <PaymentIcon />, path: "/finance/payments" },
    { text: "Process Payment", icon: <AccountBalanceWalletIcon />, path: "/finance/process-payment" },
    { text: "Purchase Orders", icon: <ShoppingCartIcon />, path: "/finance/purchase-orders" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/finance/reports" },
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
            SMART <span style={{ color: '#333' }}>FINANCE</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Welcome, <b>Finance User</b></Typography>
            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>F</Avatar>
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
            <Typography variant="overline" sx={{ px: 3, fontWeight: 'bold', color: 'text.secondary' }}>Finance Panel</Typography>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path || (location.pathname === '/finance' && item.path === '/finance/invoices')}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: (location.pathname === item.path || (location.pathname === '/finance' && item.path === '/finance/invoices')) ? '#1976d2' : 'inherit' }}>
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