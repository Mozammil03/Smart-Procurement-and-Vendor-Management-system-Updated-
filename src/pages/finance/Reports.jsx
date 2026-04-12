// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";

// import {
//   Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
//   TableBody, Container, Chip,
//   Button
// } from "@mui/material";

// import AssessmentIcon from '@mui/icons-material/Assessment';

// export default function Reports() {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = () => {
//     API.get("/reports/spend")
//       .then(res => setReports(res.data))
//       .catch(err => console.error(err));
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 2 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', gap: 2 }}>
//           <AssessmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />
//           Company Spend Report
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Overview of total company spend and purchase orders
//         </Typography>
//       </Box>

//       <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
//         <Table>
//           <TableHead sx={{ bgcolor: "#fafafa",background:'#1976d2' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold' }}>PO NUMBER</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>ORDER DATE</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>VENDOR</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reports.length > 0 ? reports.map((po) => (
//               <TableRow key={po.id} hover>
//                 <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{po.poNumber}</TableCell>
//                 <TableCell>{po.orderDate}</TableCell>
//                 <TableCell>{po.vendor?.companyName || po.vendor?.email}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={po.status} size="small"
//                     sx={{
//                       fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem',
//                       bgcolor: po.status === "COMPLETED" || po.status === "APPROVED" ? "#e8f5e9" : "#fff3e0",
//                       color: po.status === "COMPLETED" || po.status === "APPROVED" ? "#2e7d32" : "#ef6c00"
//                     }}
//                   />
//                 </TableCell>
//               </TableRow>
//             )) : <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>No reports available.</TableCell></TableRow>}
//           </TableBody>
//         </Table>
//       </Paper>
//       <button>Download Report</button>
//     </Container>
    
//   );
// }


import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Box, Typography, Paper, Table, TableHead, TableRow,
         TableCell, TableBody, Container, Chip, Button, Stack } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = () => {
    API.get("/reports/spend")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  };

  // CSV export — purely in the browser, no extra backend needed
  const exportCSV = () => {
    const headers = ["PO Number","Order Date","Vendor","PO Status",
                     "Invoice No","Invoice Amt","Paid Amt","Payment Mode",
                     "Payment Status","Payment Date"];
    const rows = reports.map(r => [
      r.poNumber, r.orderDate, r.vendorName, r.poStatus,
      r.invoiceNumber, r.invoiceAmount, r.paidAmount,
      r.paymentMode, r.paymentStatus, r.paymentDate
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "spend-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export using jsPDF (add jspdf to package.json)
  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    doc.text("Company Spend Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["PO#","Date","Vendor","Invoice Amt","Paid Amt","Status"]],
      body: reports.map(r => [
        r.poNumber, r.orderDate, r.vendorName,
        r.invoiceAmount, r.paidAmount, r.paymentStatus
      ])
    });
    doc.save("spend-report.pdf");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 3, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display:'flex', alignItems:'center', gap:2 }}>
            <AssessmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            Spend Report
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportPDF}
            sx={{ bgcolor: "#1976d2" }}>
            Export PDF
          </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ borderRadius:"12px", border:"1px solid #e0e0e0", overflow:"hidden" }}>
        <Table>
          <TableHead sx={{ background:'#1976d2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>PO Number</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Date</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Invoice Amt</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Paid Amt</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Payment Mode</TableCell>
              <TableCell sx={{ fontWeight:'bold', color:'#fff' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(r => (
              <TableRow key={r.poId} hover>
                <TableCell sx={{ fontFamily:'monospace' }}>#{r.poNumber}</TableCell>
                <TableCell>{r.orderDate}</TableCell>
                <TableCell>{r.vendorName}</TableCell>
                <TableCell>${r.invoiceAmount ?? "—"}</TableCell>
                <TableCell>${r.paidAmount ?? "—"}</TableCell>
                <TableCell>{r.paymentMode ?? "—"}</TableCell>
                <TableCell>
                  <Chip label={r.paymentStatus ?? r.poStatus} size="small"
                    sx={{ fontWeight:'bold', borderRadius:'6px' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}