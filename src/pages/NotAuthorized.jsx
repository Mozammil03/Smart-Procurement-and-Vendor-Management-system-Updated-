import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Typography, Stack } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6, display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: "secondary.main", mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You are not authorized to access this page or perform this action. Please contact your administrator or sign in with the correct account.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none" }}
            >
              Go to Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: "none" }}
            >
              Go Back
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
