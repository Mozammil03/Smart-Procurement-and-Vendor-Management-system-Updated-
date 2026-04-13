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

      console.debug("Login response:", res.data);
      const loginId = res.data.id ?? res.data.userId;
      if (!loginId) {
        showSnackbar("Login response did not include a user ID", "error");
        return;
      }

      localStorage.setItem("token", res.data.token || "");
      const normalizedRole = (res.data.role || "").replace(/^ROLE_/, "").toUpperCase();
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("userId", String(loginId));
      const explicitName =
        res.data.name ||
        res.data.username ||
        res.data.userName ||
        res.data.email ||
        res.data.firstName ||
        res.data.lastName;

      const saveDisplayName = (name) => {
        if (name) {
          localStorage.setItem("displayName", name);
        } else {
          localStorage.removeItem("displayName");
        }
      };

      if (explicitName) {
        saveDisplayName(explicitName);
      } else {
        try {
          const profile = await API.get(`/users/${loginId}`);
          saveDisplayName(
            profile.data.name ||
              profile.data.username ||
              profile.data.userName ||
              profile.data.email ||
              profile.data.firstName ||
              profile.data.lastName
          );
        } catch (err) {
          saveDisplayName(null);
        }
      }

      const role = normalizedRole;

      if (role === "VENDOR") {
        const vendorId = res.data.vendorId ?? loginId;
        localStorage.setItem("vendorId", String(vendorId));
      } else {
        localStorage.removeItem("vendorId");
      }

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
      const message = error?.response?.data?.message || error?.response?.data?.error || error?.response?.statusText || "Login Failed";
      showSnackbar(message, "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 6,
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: 360,
          maxWidth: "100%",
          textAlign: "center",
          borderRadius: 3,
          borderTop: "6px solid",
          borderTopColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4"
          sx={{
            mb: 1,
            fontWeight: "bold",
            color: "text.primary",
            letterSpacing: 1,
          }}
        >
          LOGIN
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
          Smart Procurement & Vendor Management
        </Typography>

        <Typography sx={{ mb: 2, color: "text.primary" }}>
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
                <EmailIcon color="secondary" />
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
                <LockIcon color="secondary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            mt: 4,
            mb: 2,
            py: 1.5,
            fontWeight: "bold",
          }}
          onClick={handleLogin}
        >
          LOG IN
        </Button>

        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          New to the platform?{' '}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: "bold",
              '&:hover': { textDecoration: 'underline' },
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
