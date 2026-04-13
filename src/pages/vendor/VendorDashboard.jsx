import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Button, Avatar
} from "@mui/material";

import { getUserDisplayName, getUserAvatarInitial } from "../../utils/userUtils";
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

  const displayName = getUserDisplayName();
  const displayInitial = getUserAvatarInitial(displayName);

  const logout = () => {
    console.log(localStorage)
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
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            SMART <span style={{ color: "#7a6248" }}>VENDOR</span>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              Welcome, <b>{displayName}</b>
            </Typography>
            <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
              {displayInitial}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List sx={{ pt: 2 }}>
            <Typography
              variant="overline"
              sx={{ px: 3, fontWeight: "bold", color: "text.secondary" }}
            >
              Vendor Menu
            </Typography>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={
                  location.pathname === item.path ||
                  (location.pathname === "/vendor" &&
                    item.path === "/vendor/purchase-orders")
                }
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === item.path ||
                      (location.pathname === "/vendor" &&
                        item.path === "/vendor/purchase-orders")
                        ? "primary.main"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: "auto", p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}