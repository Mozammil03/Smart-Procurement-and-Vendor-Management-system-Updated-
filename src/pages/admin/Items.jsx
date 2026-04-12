import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box, Typography, TextField, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Stack, Container, Grid,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert, InputAdornment
} from "@mui/material";

import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function Items() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    itemName: "",
    category: "",
    price: "",
  });


  const [openDelete, setOpenDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) { console.error("Load failed", err); }
  };

  const showMsg = (message, severity = "success") => 
    setSnackbar({ open: true, message, severity });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/items/${editId}`, form);
        showMsg("Item updated successfully!");
        setEditId(null);
      } else {
        await api.post("/items", form);
        showMsg("New item added to inventory!");
      }
      setForm({ itemName: "", category: "", price: "" });
      load();
    } catch (err) { showMsg("Failed to save item", "error"); }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      setOpenDelete(false);
      load();
      showMsg("Item removed successfully", "success");
    } catch (err) { showMsg("Delete operation failed", "error"); }
  };

  // const getById = async (id) => {
  // try {
  //   const res = await api.get(`/items/${id}`);
  //   console.log("Fetched item details:", res.data);
  //   setForm({
  //     itemName: res.data.itemName,
  //     category: res.data.category,
  //     price: res.data.price
  //   });
  //   setEditId(id);
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  //   showMsg("Editing item...");
  // } catch (err) {
  //   console.error("Fetch failed", err);
  //   showMsg("Could not load item details", "error");
  // }
// };

const getById = async (id) => {
  try {
    const res = await api.get(`/items/${id}`);
    console.log("Fetched item details:", res.data);
    
    setForm({
      itemName: res.data.itemName,
      category: res.data.category,
      price: res.data.price
    });
    
    setEditId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showMsg("Editing item...");
  } catch (err) {
    console.error("Fetch failed", err);
    showMsg("Could not load item details. Does the ID exist?", "error");
  }
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
    borderRadius: "12px", 
    border: "1px solid #e0e0e0",
    background: "linear-gradient(to right, #ffffff, #f8f9fa)", 
    borderLeft: "6px solid #1565c0" 
  }}
>
  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
    <InventoryIcon sx={{ fontSize: 40, color: "#1565c0" }} />
    Items Management
  </Typography>
  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
    Maintain your master inventory list and pricing
  </Typography>
</Paper>

        <Paper elevation={0} sx={{ p: 3, mb: 4, border: "1px solid #e0e0e0", borderRadius: "12px" }}>
          <form onSubmit={save}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3.5}>
                <TextField 
                  fullWidth label="Item Name" size="small" 
                  value={form.itemName} 
                  onChange={(e) => setForm({ ...form, itemName: e.target.value })} 
                  required 
                  InputProps={{ startAdornment: <InputAdornment position="start"><InventoryIcon fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={3.5}>
                <TextField 
                  fullWidth label="Category" size="small" 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })} 
                  required 
                  InputProps={{ startAdornment: <InputAdornment position="start"><CategoryIcon fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
                <TextField 
                  fullWidth label="Price" type="number" size="small" 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  required 
                  InputProps={{ startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon fontSize="small" /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
               <Stack direction="row" spacing={1}>
    <Button 
      fullWidth variant="contained" type="submit" 
      sx={{ bgcolor: editId ? "#ed6c02" : "#1976d2", fontWeight: 'bold' }}
    >
      {editId ? "UPDATE" : "SAVE"}
    </Button>
    
    {editId && (
      <Button 
        variant="outlined" color="inherit"
        onClick={() => {
          setEditId(null);
          setForm({ itemName: "", category: "", price: "" });
        }}
      >
        X
      </Button>
    )}
  </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: "12px", 
            border: "1px solid #e0e0e0", 
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <Table>
            <TableHead 
              sx={{ 
                bgcolor: "#1565c0", 
                "& .MuiTableCell-head": { 
                  color: "white", 
                  fontWeight: "bold", 
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:last-child": { borderRight: "none" }
                } 
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ borderRight: "1px solid #eee", fontWeight: 500 }}>{i.itemName}</TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>{i.category}</TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee", fontWeight: 'bold', color: '#2e7d32' }}>
                    ₹ {parseFloat(i.price).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button 
                        variant="contained" size="small" 
                        sx={{ bgcolor: "#43a047", minWidth: "80px", fontSize: '0.75rem' }}
                        onClick={() => getById(i.id)}
                      >
                        EDIT
                      </Button>
                      <Button 
                        variant="contained" size="small" 
                        sx={{ bgcolor: "#d32f2f", minWidth: "80px", fontSize: '0.75rem' }}
                        onClick={() => confirmDelete(i)}
                      >
                        DELETE
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>


      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Delete Item?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove <b>{itemToDelete?.itemName}</b>? This action is permanent.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Confirm Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}