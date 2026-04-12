import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import EmailIcon from '@mui/icons-material/Email';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        showSnackbar("Please enter email and password", "warning");
        return;
      }

      const res = await API.post("users/auth/login", {
        email: form.email,
        password: form.password,
      });

      // console.log("Login Response Data:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);
      const role = res.data.role?.toUpperCase();

      showSnackbar("Login successful!");

      setTimeout(() => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "EMPLOYEE") navigate("/employee");
        else if (role === "MANAGER") navigate("/manager");
        else if (role === "FINANCE") navigate("/finance");
        else if (role === "VENDOR") navigate("/vendor");
        else showSnackbar("Unknown role", "warning");
      }, 800);

    } catch (error) {
      showSnackbar("Login Failed", "error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7f6",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: 350,
          textAlign: "center",
          borderRadius: 3,
          borderTop: "6px solid #1976d2",
        }}
      >
        <Typography variant="h4"
        sx={{ 
            mb: 1, 
            fontWeight: "bold", 
            color: "#1976d2",
            letterSpacing: 1 
          }}>
          LOGIN
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
          Smart Procurement & Vendor Management
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Welcome user, please sign in to continue
        </Typography>

        <TextField
          fullWidth
          type="email"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary"/>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary"/>
              </InputAdornment>
            ),
            
            endAdornment: (

              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ 
            mt: 4, 
            mb: 2, 
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)"}}
      
          onClick={handleLogin}
        >
          LOG IN
        </Button>

        <Typography sx={{ mt: 2, color: "text.secondary" }}>
         New to the platform?{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ 
              color: "#1976d2", 
              cursor: "pointer", 
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" } 
            }}
            onClick={() => navigate("/pages/vendor-register/VendorRegister")}
          >
            Register here
          </Typography>
        </Typography>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}

      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}