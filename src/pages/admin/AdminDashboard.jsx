import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import api from "../../api/axios";

import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, Button, Grid, Paper, Avatar,
  Skeleton, Chip, Table, TableHead, TableRow, TableCell, TableBody, Stack
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import InventoryIcon from '@mui/icons-material/Inventory';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CategoryIcon from '@mui/icons-material/Category';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';

const drawerWidth = 260;

function StatCard({ title, value, color, icon, subtitle, loading }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={0} sx={{
        p: 3, borderRadius: 3,
        borderLeft: `6px solid ${color}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        bgcolor: 'white',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={60} height={48} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, color: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Stack>
      </Paper>
    </Grid>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [recentPOs, setRecentPOs] = useState([]);
  const [recentVendors, setRecentVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const showOverview = location.pathname === "/admin" || location.pathname === "/admin/";

  const logout = () => { localStorage.clear(); navigate("/"); };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, poRes, vendorRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/po"),
        api.get("/vendors"),
      ]);
      setStats(statsRes.data);
      // Most recent 5 POs
      setRecentPOs([...poRes.data].reverse().slice(0, 5));
      // Most recent 5 vendors
      setRecentVendors([...vendorRes.data].reverse().slice(0, 5));
    } catch (err) {
      console.error("Dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const menuItems = [
    { text: "Roles", icon: <VerifiedUserIcon />, path: "/admin/roles" },
    { text: "Departments", icon: <BusinessCenterIcon />, path: "/admin/departments" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  ];

  const procurementItems = [
    { text: "Items", icon: <InventoryIcon />, path: "/admin/items" },
    { text: "Purchase Order", icon: <ShoppingCartIcon />, path: "/admin/PurchaseOrder" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/admin/Inventory" },
    { text: "Vendor Approval", icon: <VerifiedUserIcon />, path: "/admin/VendorApproval" },
    { text: "Vendor Ratings", icon: <StarIcon />, path: "/admin/vendor-ratings" },
    { text: "Vendor Documents", icon: <DescriptionIcon />, path: "/admin/vendor-documents" },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7f6", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={0} sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "white", color: "text.primary", borderBottom: "1px solid #e0e0e0"
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            SMART <span style={{ color: '#333' }}>PROCURE</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Welcome, <b>Admin</b></Typography>
            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", border: 'none', boxShadow: '2px 0 10px rgba(0,0,0,0.05)' },
      }}>
        <Toolbar />
        <Box sx={{ overflow: "auto", display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            <Typography variant="overline" sx={{ px: 3, fontWeight: 'bold', color: 'text.secondary' }}>Master Data</Typography>
            {menuItems.map((item) => (
              <ListItemButton key={item.text} component={Link} to={item.path}
                selected={location.pathname === item.path}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 1, mx: 2 }} />

          <List>
            <Typography variant="overline" sx={{ px: 3, fontWeight: 'bold', color: 'text.secondary' }}>Procurement</Typography>
            {procurementItems.map((item) => (
              <ListItemButton key={item.text} component={Link} to={item.path}
                selected={location.pathname === item.path}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 'auto', p: 2 }}>
            <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>Logout</Button>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />

        {showOverview && (
          <>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a2e' }}>Dashboard Overview</Typography>
                <Typography variant="body2" color="text.secondary">Live procurement & vendor data</Typography>
              </Box>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadDashboard} size="small">
                Refresh
              </Button>
            </Stack>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
              <StatCard
                title="Pending Vendor Approvals"
                value={stats?.pendingVendors ?? "—"}
                color="#ed6c02"
                icon={<PendingActionsIcon />}
                subtitle={`${stats?.approvedVendors ?? 0} approved`}
                loading={loading}
              />
              <StatCard
                title="Active Vendors"
                value={stats?.approvedVendors ?? "—"}
                color="#1976d2"
                icon={<StorefrontIcon />}
                subtitle={`${stats?.totalVendors ?? 0} total`}
                loading={loading}
              />
              <StatCard
                title="Total Purchase Orders"
                value={stats?.totalPurchaseOrders ?? "—"}
                color="#2e7d32"
                icon={<ShoppingCartIcon />}
                subtitle="All time"
                loading={loading}
              />
              <StatCard
                title="Low Stock Alerts"
                value={stats?.lowStockAlerts ?? "—"}
                color="#d32f2f"
                icon={<WarningAmberIcon />}
                subtitle="Items below qty 10"
                loading={loading}
              />
            </Grid>

            {/* Second row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard
            title="Pending Requisitions"
            value={stats?.pendingRequisitions ?? "—"}
            color="#9c27b0"
            icon={<PendingActionsIcon />}
            subtitle="Awaiting approval"
            loading={loading}
          />
          <StatCard
            title="Total Items"
            value={stats?.totalItems ?? "—"}
            color="#0288d1"
            icon={<CategoryIcon />}
            subtitle="In item master"
            loading={loading}
          />
          <StatCard
            title="Total Spend"
            value={stats ? `₹${Number(stats.totalSpend).toLocaleString('en-IN')}` : "—"}
            color="#00796b"
            icon={<CurrencyRupeeIcon />}
            subtitle="From all POs"
            loading={loading}
          />
          <StatCard
            title="Total Vendors"
            value={stats?.totalVendors ?? "—"}
            color="#5c6bc0"
            icon={<StorefrontIcon />}
            subtitle="Registered"
            loading={loading}
          />
        </Grid>

        {/* Recent POs + Recent Vendors */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0", overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Purchase Orders</Typography>
                <Button size="small" component={Link} to="/admin/PurchaseOrder">View All</Button>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: "#1a237e" }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>PO Number</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vendor</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [1,2,3].map(i => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : recentPOs.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No purchase orders yet</TableCell></TableRow>
                  ) : recentPOs.map(po => (
                    <TableRow key={po.id} hover>
                      <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{po.poNumber}</TableCell>
                      <TableCell>{po.vendor?.companyName || "—"}</TableCell>
                      <TableCell sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                        {po.totalAmount != null ? `₹${Number(po.totalAmount).toLocaleString('en-IN')}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Chip label={po.status || "CREATED"} size="small"
                          sx={{ bgcolor: "#e8eaf6", color: "#1a237e", fontWeight: 'bold', fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0", overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Vendors</Typography>
                <Button size="small" component={Link} to="/admin/VendorApproval">View All</Button>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: "#1a237e" }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [1,2,3].map(i => (
                      <TableRow key={i}>
                        <TableCell colSpan={2}><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : recentVendors.length === 0 ? (
                    <TableRow><TableCell colSpan={2} align="center" sx={{ py: 3, color: 'text.secondary' }}>No vendors yet</TableCell></TableRow>
                  ) : recentVendors.map(v => (
                    <TableRow key={v.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28, bgcolor: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem' }}>
                            {v.companyName?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="bold">{v.companyName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={v.approved ? "APPROVED" : "PENDING"}
                          size="small"
                          sx={{
                            fontWeight: 'bold', fontSize: '0.65rem', borderRadius: '6px',
                            bgcolor: v.approved ? "#e8f5e9" : "#fff3e0",
                            color: v.approved ? "#2e7d32" : "#ef6c00"
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
        </>) }
        <Outlet />
      </Box>
    </Box>
  );
}
