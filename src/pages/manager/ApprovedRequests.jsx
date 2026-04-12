import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

export default function ApprovedRequests() {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/approvals");
    setApprovals(res.data);
    console.log(res.data); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Approved Requests
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Approved Date</b></TableCell>
              <TableCell><b>Item</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Remarks</b></TableCell>
             
            </TableRow>
          </TableHead>

          <TableBody>
            {approvals
              .filter((a) => a.decision === "APPROVED")
              .map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>
                    {a.approvedDate ? new Date(a.approvedDate).toLocaleDateString() : "N/A"}
                  </TableCell>

                  <TableCell>
                    {a.requisition.item.itemName|| "N/A"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={a.decision}
                      color="success"
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {a.remarks || "No remarks"}
                  </TableCell>
                  
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}