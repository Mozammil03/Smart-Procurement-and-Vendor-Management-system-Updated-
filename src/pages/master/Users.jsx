import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser, updateUser, getUserById } from "../../api/userService";
import { getRoles } from "../../api/roleService";
import { getDepartments } from "../../api/departmentService";

import {
  Box, Typography, TextField, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Stack, IconButton,
  InputAdornment, Chip, Container,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Avatar
} from "@mui/material";

import Grid from '@mui/material/Grid'; 


import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [searchId, setSearchId] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null)

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    roleId: "",
    departmentId: "",
    active: true
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const load = async () => {
    try {
      const [u, r, d] = await Promise.all([getUsers(), getRoles(), getDepartments()]);
      setUsers(u.data || []);
      setRoles(r.data || []);
      setDepartments(d.data || []);
    } catch (err) { 
      console.error("Load failed", err); 
      showMsg("Failed to load data", "error");
    }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (msg, sev = "success") => setSnackbar({ open: true, message: msg, severity: sev });

  const handleOpenForm = (user = null) => {
    if (user) {
      if (user && user.role?.roleName === 'ADMIN') {
     showMsg("System Administrators cannot be edited directly", "error");
     return;
  }
      setEditingId(user.id);
      setForm({
        username: user.username || "",
        password: "", 
        email: user.email || "",
        roleId: user.role?.id || "",
        departmentId: user.department?.id || "",
        active: !!user.active
      });
    } else {
      setEditingId(null);
      setForm({ username: "", password: "", email: "", roleId: "", departmentId: "", active: true });
    }
    setOpenForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      username: form.username,
      password: form.password,
      email: form.email,
      active: form.active,
      role: { id: form.roleId },
      department: { id: form.departmentId }
    };

    try {
      if (editingId) await updateUser(editingId, payload);
      else await createUser(payload);
      
      setOpenForm(false);
      load();
      showMsg(editingId ? "User updated" : "User created");
    } catch (err) { showMsg("Operation failed", "error"); }
  };

  // const confirmDelete = async (id) => {
  //   if(!window.confirm("Are you sure you want to delete this user?")) return;
  //   try {
  //     await deleteUser(id);
  //     load();
  //     showMsg("User deleted", "success");
  //   } catch (err) { showMsg("Delete failed", "error"); }
  // };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };


  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      load();
      showMsg("User deleted successfully");
    } catch (err) { 
      showMsg("Delete failed", "error"); 
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        
{/*         
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
              <GroupIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">Manage employee access, roles, and departmental assignments</Typography>
          </Box>
          <Button variant="contained" color="success" startIcon={<PersonAddIcon />} onClick={() => handleOpenForm()} sx={{ borderRadius: 2, px: 3 }}>
            New User
          </Button>
        </Stack> */}

      
<Paper 
  elevation={0} 
  sx={{ 
    p: 4, 
    mb: 4, 
    textAlign: 'center', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    borderRadius: "12px", 
    border: "1px solid #e0e0e0",
    background: "linear-gradient(to right, #ffffff, #f8f9fa)", 
    borderLeft: "6px solid #1565c0" 
  }}
>
  <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
              <GroupIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">Manage employee access, roles, and departmental assignments</Typography>
  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
    Maintain your master inventory list and pricing
  </Typography>
  
</Paper>

        <Grid container spacing={3}>
        
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField 
                  label="Search by ID" 
                  size="small" 
                  value={searchId} 
                  onChange={(e) => setSearchId(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                />
                <Button variant="contained" color="inherit" onClick={async () => {
                  if(!searchId) return load();
                  try {
                    const res = await getUserById(searchId);
                    setUsers(res.data ? [res.data] : []);
                  } catch (err) { showMsg("User not found", "error"); }
                }}>Search</Button>
                <Button variant="outlined" onClick={load}><RestartAltIcon /></Button>
                <Button variant="contained" color="success" startIcon={<PersonAddIcon />} onClick={() => handleOpenForm()} sx={{ borderRadius: 2, px: 3}}>
            New User
          </Button>
              </Stack>
               
            </Paper>
          </Grid>

        
          <Grid size={12}>
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>USER</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ROLE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>DEPARTMENT</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', pr: 4 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: u.active ? "#2e7d32" : "#bdbdbd", width: 32, height: 32, fontSize: '0.9rem' }}>
                          
                            {u.username?.[0]?.toUpperCase() || "?"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{u.username || "Unknown"}</Typography>
                            <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell><Chip label={u.role?.roleName || 'N/A'} size="small" variant="outlined" /></TableCell>
                      <TableCell><Typography variant="body2">{u.department?.name || 'N/A'}</Typography></TableCell>
                      <TableCell>
                        <Chip 
                          label={u.active ? "Active" : "Inactive"} 
                          color={u.active ? "success" : "default"} 
                          size="small" 
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 2 }}>
                        <IconButton onClick={() => handleOpenForm(u)} size="small" color="primary" disabled={u.role?.roleName === 'ADMIN'}><EditIcon fontSize="small" /></IconButton>
                        <IconButton onClick={() => handleDeleteClick(u)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">No users found.</Typography>
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>{editingId ? "Update User Profile" : "Create New User"}</DialogTitle>
        <form onSubmit={submit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></Grid>
              {!editingId && (
                <Grid size={12}><TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required /></Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" value={form.roleId} onChange={(e) => setForm({...form, roleId: e.target.value})} required>
                    {roles.map(r => <MenuItem key={r.id} value={r.id}>{r.roleName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select label="Department" value={form.departmentId} onChange={(e) => setForm({...form, departmentId: e.target.value})} required>
                    {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Checkbox checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} color="success" />} label="Account Active" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="success">Save User</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <WarningAmberIcon /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <b>{userToDelete?.username}</b>? 
            This action will permanently remove their access from the system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}