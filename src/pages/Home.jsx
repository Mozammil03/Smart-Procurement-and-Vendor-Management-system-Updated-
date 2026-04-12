import { useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Card, CardContent, Stack, Divider, Avatar, Paper
} from "@mui/material";
import Grid from '@mui/material/Grid'; 

import TerminalIcon from '@mui/icons-material/Terminal';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function Home() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ bgcolor: "#fff" }}>

      <AppBar position="sticky" sx={{ bgcolor: "white", color: "#333" }} elevation={1}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, color: "#1976d2", letterSpacing: 1 }}>
            SmartProcure
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button onClick={() => scrollTo("services")} sx={{ fontWeight: 600 }}>Services</Button>
            <Button onClick={() => scrollTo("work")} sx={{ fontWeight: 600 }}>Our Journey</Button>
            <Button onClick={() => scrollTo("about")} sx={{ fontWeight: 600 }}>About</Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button onClick={() => navigate("/login")} variant="outlined" sx={{ borderRadius: 2 }}>Login</Button>
            <Button
              variant="contained"
              onClick={() => navigate("/pages/vendor-register/VendorRegister")}
              sx={{ ml: 1, borderRadius: 2, fontWeight: 'bold' }}
            >
              Register
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)",
          color: "#fff",
          clipPath: "ellipse(100% 85% at 50% 15%)",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Next-Gen Procurement Management
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Streamlining vendor onboarding, automated approvals, and real-time order tracking 
            for modern enterprises. Built with precision and industry-standard architecture.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, py: 1.5, fontWeight: 'bold', bgcolor: "#ff9100", '&:hover': { bgcolor: "#ff6d00" } }}
              onClick={() => navigate("/login")}
            >
              Launch Dashboard
            </Button>
          </Stack>
        </Container>
      </Box>

         <Container sx={{ py: 10 }} id="services">
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 6 }}>
          Core Solutions
        </Typography>
        <Grid container spacing={4}>
          <ServiceCard 
            title="Vendor Management" 
            desc="Efficient onboarding, performance metrics, and compliance tracking." 
            icon={<GroupsIcon sx={{ fontSize: 40, color: "#1976d2" }} />} 
          />
          <ServiceCard 
            title="Workflow Automation" 
            desc="Intelligent approval chains for requisitions and purchase orders." 
            icon={<AssignmentTurnedInIcon sx={{ fontSize: 40, color: "#1976d2" }} />} 
          />
          <ServiceCard 
            title="Real-time Tracking" 
            desc="Full visibility into the procurement lifecycle from request to delivery." 
            icon={<RocketLaunchIcon sx={{ fontSize: 40, color: "#1976d2" }} />} 
          />
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#f8f9fa", py: 10 }} id="work">
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                The Development Journey
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", mb: 2, fontSize: "1.1rem", lineHeight: 1.8 }}>
                SmartProcure was conceptualized and developed during the <strong>Infosys Springboard Virtual Internship 6.0</strong>. 
                Our mission was to solve real-world procurement bottlenecks using a scalable tech stack.
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", mb: 4, fontSize: "1.1rem", lineHeight: 1.8 }}>
                The project follows a <strong>Micro-service ready architecture</strong>, ensuring high reliability 
                and sub-second latency.
              </Typography>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>100%</Typography>
                  <Typography variant="caption">Automated Workflow</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>REST</Typography>
                  <Typography variant="caption">API Integration</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: "#fff", border: "1px solid #e0e0e0" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TerminalIcon color="primary" /> Engineering Highlights
                </Typography>
                <CustomList 
                  items={[
                    "Secure JWT Authentication & Role-based Access",
                    "Dynamic Vendor Onboarding & Approval System",
                    "Integrated Inventory & Warehouse Management",
                    "Real-time Status Tracking & Documentation"
                  ]} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 10 }} id="about">
        <Stack alignItems="center" sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>The Team Behind SmartProcure</Typography>
          <Typography variant="h6" color="text.secondary">Infosys Springboard Internship - Batch 6.0</Typography>
        </Stack>

        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%', borderRadius: 4, textAlign: 'center', p: 2 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Madhuri Ankolekar</Typography>
                <Typography color="primary" gutterBottom sx={{ fontWeight: 600 }}>Project Mentor</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: "#666" }}>
                  "Guiding us through the complexities of enterprise-grade development and 
                  ensuring our architecture met industry standards."
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
  <Card sx={{ height: '100%', borderRadius: 4, textAlign: 'center', p: 2 }}>
    <CardContent>
      <Avatar sx={{ bgcolor: "#2e7d32", width: 64, height: 64, mx: 'auto', mb: 2 }}>
        <GroupsIcon />
      </Avatar>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Collaboration & Core Dev</Typography>
      <Typography color="primary" gutterBottom sx={{ fontWeight: 600 }}>Partha, Ganesh & Presentation Team</Typography>
    

      <Typography variant="body2" sx={{ color: "#666", mt: 2 }}>
        A massive shoutout to <strong>Partha</strong>, who architected and designed the vast 
        majority of the platform's interface and frontend logic. Special thanks to 
        <strong> Ganesh</strong> for his contributions to the design modules and the 
        dedicated presentation team.
      </Typography>
    </CardContent>
  </Card>
</Grid>
        </Grid>

        <Box sx={{ mt: 8, p: 4, bgcolor: "#e3f2fd", borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d47a1" }}>
            Technical Stack: React.js | Spring Boot | MySQL | Material UI | REST APIs
          </Typography>
        </Box>
      </Container>

      <Box sx={{ py: 10, textAlign: "center", bgcolor: "#1a237e", color: "white" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
          Ready to Experience the Transformation?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 6, py: 2, borderRadius: 3, fontWeight: 'bold', bgcolor: "#ffc107", color: "#000", '&:hover': { bgcolor: "#ffb300" } }}
          onClick={() => navigate("/login")}
        >
          Explore the Dashboard
        </Button>
      </Box>

    </Box>
  );
}

function ServiceCard({ title, desc, icon }) {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{desc}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function CustomList({ items, sx }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, color: "#555", ...sx }}>
      {items.map((text, index) => (
        <Typography 
          key={index} 
          component="li" 
          variant="body1" 
          sx={{ mb: 1.5, fontWeight: 500, display: 'flex', alignItems: 'start' }}
        >
          <Box component="span" sx={{ mr: 1 }}>•</Box> {text}
        </Typography>
      ))}
    </Box>
  );
}