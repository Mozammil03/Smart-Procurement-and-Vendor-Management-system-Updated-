import { useEffect, useState } from "react";
import { getDepartments, createDepartment } from "../../api/departmentService";
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
  IconButton,
  TableBody,
  Stack,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Container,
  Grid
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BusinessIcon from '@mui/icons-material/Business';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [searchId, setSearchId] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDept, setSelectedDept] = useState({ id: null, name: "", location: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const load = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) { console.error("Error loading departments", err); }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (msg, sev = "success") => setSnackbar({ open: true, message: msg, severity: sev });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createDepartment({ name, location });
      setName("");
      setLocation("");
      load();
      showMsg("Department added successfully!");
    } catch (err) { showMsg("Failed to add department", "error"); }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/departments/${selectedDept.id}`);
      setOpenDelete(false);
      load();
      showMsg("Department removed", "success");
    } catch (err) { showMsg("Error deleting department", "error"); }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/departments/${selectedDept.id}`, {
        name: selectedDept.name,
        location: selectedDept.location,
      });
      setOpenEdit(false);
      load();
      showMsg("Department updated successfully");
    } catch (err) { showMsg("Update failed", "error"); }
  };

  return (
    <Box sx={{ bgcolor: "#f4f7f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        
      
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, mb: 4, textAlign: 'center', borderRadius: "16px", border: "1px solid #e0e0e0",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderLeft: "8px solid #3f51b5" 
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <BusinessIcon sx={{ fontSize: 45, color: "#3f51b5" }} />
            Department Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
            Organize and track company infrastructure and office locations
          </Typography>
        </Paper>

        <Grid container spacing={3}>
        
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #e0e0e0", height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#3f51b5" }}>Add New Department</Typography>
              <form onSubmit={submit}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Department Name" size="small" fullWidth required
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Location" size="small" fullWidth required
                    value={location} onChange={(e) => setLocation(e.target.value)}
                  />
                  <Button type="submit" variant="contained" sx={{ px: 4, bgcolor: '#3f51b5', fontWeight: 'bold' }}>
                    ADD
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>

        
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "12px", border: "1px solid #e0e0e0", height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#666" }}>Quick Search</Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Search ID" size="small" fullWidth
                  value={searchId} onChange={(e) => setSearchId(e.target.value)}
                />
                <Button 
                  variant="contained" color="inherit" 
                  onClick={async () => {
                    if(!searchId) return load();
                    try { const res = await API.get(`/departments/${searchId}`); setDepartments(res.data ? [res.data] : []); } catch { setDepartments([]); }
                  }}
                >
                  <SearchIcon />
                </Button>
                <Button variant="outlined" onClick={() => {setSearchId(""); load();}}>
                  <RestartAltIcon />
                </Button>
              </Stack>
            </Paper>
          </Grid>

          
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ borderRadius: "12px",mt: 5, display:'flex',ml:25,border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#3f51b5" }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>NAME</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>LOCATION</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.length > 0 ? (
                      departments.map((d) => (
                        <TableRow key={d.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: '#777' }}>#{d.id}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{d.name}</TableCell>
                          <TableCell>{d.location}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton 
                                onClick={() => { setSelectedDept(d); setOpenEdit(true); }} 
                                size="small" 
                                sx={{ color: '#3f51b5', bgcolor: '#f0f2ff', '&:hover': { bgcolor: '#e0e4ff' } }}
                              >
                                <EditIcon fontSize="small" /> Edit
                              </IconButton>
                              <IconButton 
                                onClick={() => { setSelectedDept(d); setOpenDelete(true); }} 
                                size="small" 
                                sx={{ color: '#d32f2f', bgcolor: '#fff5f5', '&:hover': { bgcolor: '#ffebeb' } }}
                              >
                                <DeleteIcon fontSize="small" />Delete
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No departments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

    
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Update Department</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={selectedDept.name} onChange={(e) => setSelectedDept({ ...selectedDept, name: e.target.value })} margin="normal" />
          <TextField fullWidth label="Location" value={selectedDept.location} onChange={(e) => setSelectedDept({ ...selectedDept, location: e.target.value })} margin="normal" />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ bgcolor: '#3f51b5' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Remove Department?</DialogTitle>
        <DialogContent>
          <DialogContentText>Deleting <b>{selectedDept.name}</b> will remove it from the system. This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

  
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

    </Box>
  );
}