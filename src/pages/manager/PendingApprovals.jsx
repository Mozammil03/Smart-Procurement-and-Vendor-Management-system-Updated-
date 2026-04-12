import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
} from "@mui/material";

export default function PendingApprovals() {
  const [list, setList] = useState([]);
  const [ManagerName, setManagerName] = useState("");

  useEffect(() => {
     const fetchProfile = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if (userId) {
          
            const res = await api.get(`/users/${userId}`); 
            setManagerName(res.data.name || res.data.username);
          }
        } catch (err) {
          console.error("Could not fetch profile", err);
          setManagerName("Manager");
        }
      };
    
    fetchProfile();
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/requisitions");
    setList(res.data);
  };

  const approve = async (id) => {
    await api.post(`/approvals/${id}`, {
      managerName: ManagerName,
      status: "APPROVED",
      remarks: "Approved by manager",
    });

    alert("Approved Successfully");
    load();
  };

  return (
    <Box sx={{ p: 2 }}>
  
      <Typography variant="h5" gutterBottom>
        Pending Approvals
      </Typography>

  
      <Grid container spacing={2}>
        {list
          .filter((r) => r.status === "PENDING")
          .map((r) => (
            <Grid item xs={12} md={6} lg={4} key={r.id}>
              <Card elevation={3}>
                <CardContent>

                  <Typography variant="h6" gutterBottom>
                    Request ID: {r.id}
                  </Typography>

                  <Typography>
                    <b>Item:</b> {r.item?.itemName || "N/A"}
                  </Typography>

                  <Typography>
                    <b>Quantity:</b> {r.quantity}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Typography><b>Status:</b></Typography>
                    <Chip label={r.status} color="warning" size="small" />
                  </Stack>

                
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => approve(r.id)}
                  >
                    Approve
                  </Button>

                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}