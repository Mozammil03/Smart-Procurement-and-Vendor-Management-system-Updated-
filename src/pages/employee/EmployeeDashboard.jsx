import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

import { getUserDisplayName, getUserAvatarInitial } from "../../utils/userUtils";
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
  const displayName = getUserDisplayName();
  const displayInitial = getUserAvatarInitial(displayName);

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
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #eee",
          },
        }}
      >
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "secondary.main" }}
          >
            SMART <span style={{ color: "#7a6248" }}>EMP</span>
          </Typography>
        </Box>
        <Divider variant="middle" sx={{ mb: 2 }} />
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: "8px",
                mb: 1,
                py: 1.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(179, 143, 92, 0.16)",
                  color: "primary.main",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 45 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            sx={{ borderRadius: "8px", fontWeight: 800 }}
          >
            LOGOUT
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              borderTop: "6px solid",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "text.primary" }}
                  >
                    Welcome Back, {displayName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Access inventory and manage your procurement requisitions.
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}
                >
                  {displayInitial}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={3} sx={{ mb: 5 }}>
            <StatCard
              title="Total Items"
              count={items.length}
              color="secondary.main"
              icon={<CategoryIcon />}
            />
            <StatCard
              title="Inventory Records"
              count={inventory.length}
              color="#6e5135"
              icon={<WarehouseIcon />}
            />
            <StatCard
              title="My Requests"
              count={reqs.length}
              color="secondary.main"
              icon={<ListAltIcon />}
            />
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Available Items Catalogue
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: "secondary.main",
                      "& .MuiTableCell-head": {
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((i) => (
                      <TableRow key={i.id} hover>
                        <TableCell sx={{ borderRight: "1px solid #eee" }}>
                          #{i.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #eee",
                            fontWeight: 600,
                          }}
                        >
                          {i.itemName}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={i.category}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Live Stock Levels
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: "secondary.main",
                      "& .MuiTableCell-head": {
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {inv.item?.itemName}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={inv.quantityAvailable}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              bgcolor:
                                inv.quantityAvailable < 5
                                  ? "#f6e2d7"
                                  : "#f3e5cf",
                              color:
                                inv.quantityAvailable < 5
                                  ? "#9c3c31"
                                  : "#6e5135",
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