import React,{ useState } from "react";
//import axios from "../api/axios";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  Snackbar,
  Button,
  Alert,
} from "@mui/material";

import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PrivateConnectivityIcon from '@mui/icons-material/PrivateConnectivity';
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhoneIcon from '@mui/icons-material/Phone';

export default function VendorRegister() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    gstNumber: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });
  
    const showSnackbar = (message, severity = "success") => {
      setSnackbar({ open: true, message, severity });
    };

  const handleChange = (e) => {
    setForm({...form,[e.target.name]:e.target.value});
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  }

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    Object.keys(form).forEach((key) => {
      if (!form[key] || form[key].trim() === "") {
        tempErrors[key] = true;
        isValid = false;
      }
    });

    setErrors(tempErrors);
    return isValid;
  };

  function SignInLink() {
  return (
    <Typography variant="body2">
      Already have an account?{' '}
      <Link href="/login" variant="body2" underline="hover">
        Sign In
      </Link>
    </Typography>
  );
}


  const registerVendor = async () => {
    if (!validateForm()) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }
    try {
      await axios.post("/vendors", form);
      showSnackbar("Vendor Registered Successfully. Wait for approval.", "success");
      setForm({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    gstNumber: "",
    password: ""
  })

      setTimeout(() => {
      navigate("/login");
    }, 800);
      
    } catch (error) {
      showSnackbar("Registration Failed", "error");
    }
  };

  return (
    <div >


      <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", 
        // backgroundColor: "#eef2f6",
        padding: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 450, 
          textAlign: "center",
          borderRadius: 2,
          borderTop: '5px solid #1976d2',
        }}
      >

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
        Vendor Registration
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Join our procurement network
        </Typography>
  
      <TextField
          fullWidth
          type="text"
          label="Company Name"
          name="companyName"
          required
          value={form.companyName}
          placeholder="Company Name"
          onChange={handleChange}
          margin="normal"
          error={!!errors.companyName}
        helperText={errors.companyName ? "Company Name is required" : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        

  
      <TextField
          fullWidth
          label="Contact Person"
          type="text"
          name="contactPerson"
          required
          value={form.contactPerson}
          onChange={handleChange}
          margin="normal"
          error={!!errors.contactPerson}
        helperText={errors.contactPerson ? "Contact Person is required" : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle color="primary"/>
              </InputAdornment>
            ),
          }}
        />

      <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          margin="normal"
          error={!!errors.email}
        helperText={errors.email ? "Email is required" : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

      <TextField
          fullWidth
          label="Phone"
          name="phone"
          type="text"
          placeholder="xxx-xxx-xx89"
          required
          value={form.phone}
          onChange={handleChange}
          margin="normal"
          error={!!errors.phone}
        helperText={errors.phone ? "Phone is required without +91" : ""}
        
        InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="primary"/>
              </InputAdornment>
            ),
          }}
        />

      <TextField
          fullWidth
          type="text"
          label="GST Number"
          placeholder="GSTIN1234567"
          required
          name="gstNumber"
          error={!!errors.gstNumber}
          helperText={errors.gstNumber ? "GST Number is required" : ""}
          value={form.gstNumber}
          onChange={handleChange}
          margin="normal"
        />

      <TextField
          fullWidth
          label="Password"
          required
          name="password"
          error={!!errors.password}
          helperText={errors.password ? "Password is required" : ""}
          type="text"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          margin="normal"

          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PrivateConnectivityIcon color="primary"/>
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
       onClick={registerVendor}>
        Register
      </Button>

    <Box sx={{ textAlign: 'center' }}>
      <SignInLink />
    </Box>
    </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
    </div>
  );
}