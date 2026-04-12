import { useEffect, useState } from "react";
import { getRoles, createRole } from "../../api/roleService";
import API from "../../api/axios";

import {
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableHead,
  TableRow, 
  TableCell, 
  TableBody, 
  Stack, 
  IconButton,
  Chip, 
  Grid,
  Card, 
  CardContent, 
  Container,
  Dialog, 
  DialogActions, 
  DialogContent,
  DialogContentText, 
  DialogTitle,
  Snackbar, Alert
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SecurityIcon from '@mui/icons-material/Security';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [searchId, setSearchId] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState({ id: null, roleName: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) { console.error("Error loading roles", err); }
  };

  useEffect(() => { loadRoles(); }, []);

  const showMsg = (msg, sev = "success") => setSnackbar({ open: true, message: msg, severity: sev });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRole({ roleName: roleName.toUpperCase() });
      setRoleName("");
      loadRoles();
      showMsg("Role created successfully!");
    } catch (err) { showMsg("Failed to create role", "error"); }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/roles/${selectedRole.id}`);
      setOpenDelete(false);
      loadRoles();
      showMsg("Role deleted successfully", "success");
    } catch (err) { showMsg("Error deleting role", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/roles/${selectedRole.id}`, { roleName: selectedRole.roleName.toUpperCase() });
      setOpenEdit(false);
      loadRoles();
      showMsg("Role updated successfully", "success");
    } catch (err) { showMsg("Update failed", "error"); }
  };

  const getRoleColor = (name) => {
    const role = name.toUpperCase();
    if (role.includes("ADMIN")) return { bg: "#ffebee", text: "#d32f2f", border: "#ef9a9a" };
    if (role.includes("MANAGER")) return { bg: "#fff3e0", text: "#ef6c00", border: "#ffe0b2" };
    if (role.includes("VENDOR")) return { bg: "#e8f5e9", text: "#2e7d32", border: "#c8e6c9" };
    return { bg: "#f5f5f5", text: "#616161", border: "#e0e0e0" };
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg"> 
        

        
<Paper 
  elevation={0} 
  sx={{ 
    p: 4, 
    mb: 4, 
    textAlign: 'center', 
    borderRadius: "16px", 
    border: "1px solid #e0e0e0",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    borderLeft: "8px solid #1565c0", 
    position: 'relative',
    overflow: 'hidden'
  }}
>
  <Typography 
    variant="h4" 
    sx={{ 
      fontWeight: 800, 
      color: "#1a237e", 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 2,
      position: 'relative',
      zIndex: 1
    }}
  >
    <SecurityIcon sx={{ fontSize: 45, color: "#1565c0" }} />
    Roles Management
  </Typography>
  <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
    Securely manage system authority and access groups
  </Typography>
</Paper>

        <Grid container spacing={4} >
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Create Role</Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Title" value={roleName} onChange={(e) => setRoleName(e.target.value)} size="small" sx={{ mb: 2 }} required />
                    <Button fullWidth variant="contained" type="submit" startIcon={<AddIcon />} sx={{ borderRadius: 2 ,mb: 2}}>Add Role</Button>
                  </form>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Search Database</Typography>
                  <TextField fullWidth label="Role ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} size="small" sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="inherit" fullWidth onClick={async () => {
                      try { const res = await API.get(`/roles/${searchId}`); setRoles(res.data ? [res.data] : []); } catch { setRoles([]); }
                    }}>Search</Button>
                    <Button variant="outlined" onClick={loadRoles}><RestartAltIcon /></Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ROLE</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', pr: 4 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((r) => {
                    const colors = getRoleColor(r.roleName);
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>#{r.id}</Typography></TableCell>
                        <TableCell>
                          <Chip label={r.roleName} sx={{ fontWeight: 'bold', bgcolor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '6px' }} />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 2 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton onClick={() => { setSelectedRole(r); setOpenEdit(true); }} 
                            size="small" 
                            color="primary">
                              <EditIcon fontSize="small" /></IconButton>
                            <IconButton onClick={() => { setSelectedRole(r); setOpenDelete(true); }} 
                            size="small" color="error">
                              <DeleteIcon fontSize="small" /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Update Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Modify the role name for ID #{selectedRole.id}</DialogContentText>
          <TextField fullWidth label="New Role Name" value={selectedRole.roleName} 
          onChange={(e) => setSelectedRole({ ...selectedRole, roleName: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete <b>{selectedRole.roleName}</b>? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete Role</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} 
      onClose={() => setSnackbar({ ...snackbar, open: false })} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}