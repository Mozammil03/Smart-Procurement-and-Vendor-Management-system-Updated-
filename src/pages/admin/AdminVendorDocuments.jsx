import { useEffect, useState } from "react";
import { getVendorDocuments, reviewVendorDocument, deleteVendorDocument } from "../../api/vendorService";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminVendorDocuments() {
  const [vendorName, setVendorName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [commentById, setCommentById] = useState({});
  const [statusById, setStatusById] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showMsg = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadDocuments = async (filterValue) => {
    try {
      const parsedVendorId = filterValue && /^\d+$/.test(filterValue) ? Number(filterValue) : undefined;
      const res = await getVendorDocuments({
        vendorId: parsedVendorId,
        vendorName: parsedVendorId ? undefined : filterValue,
      });
      const docs = res.data || [];
      setDocuments(docs);
      setCommentById(docs.reduce((acc, doc) => {
        acc[doc.id] = doc.adminComment || "";
        return acc;
      }, {}));      setStatusById(docs.reduce((acc, doc) => {
        acc[doc.id] = doc.status || "PENDING";
        return acc;
      }, {}));
      setEditingId(null);    } catch (err) {
      console.error("Unable to load vendor documents", err);
      showMsg("Unable to load vendor documents", "error");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSearch = () => {
    loadDocuments(vendorName.trim());
  };

  const handleReset = () => {
    setVendorName("");
    loadDocuments();
  };

  const handleCommentChange = (id, value) => {
    setCommentById((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (id, value) => {
    setStatusById((prev) => ({ ...prev, [id]: value }));
  };

  const enterEditMode = (id, status) => {
    setStatusById((prev) => ({ ...prev, [id]: status }));
    setEditingId(id);
  };

  const handleReview = async (id) => {
    try {
      await reviewVendorDocument(id, {
        status: statusById[id],
        adminComment: commentById[id] || "",
      });
      showMsg(`Document updated successfully`);      setEditingId(null);      loadDocuments(vendorName.trim());
    } catch (err) {
      console.error("Review failed", err?.response?.status, err?.response?.data || err);
      showMsg("Failed to update document status", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVendorDocument(id);
      showMsg("Document deleted successfully");
      loadDocuments(vendorName.trim());
    } catch (err) {
      console.error("Delete failed", err);
      showMsg("Failed to delete document", "error");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: 900, color: "#0d47a1" }}
        >
          Vendor Document Review
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Search vendor documents by company name and approve or reject uploaded
          files with comments.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <TextField
            label="Search by Vendor ID or Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ whiteSpace: "nowrap" }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{ whiteSpace: "nowrap" }}
          >
            Reset
          </Button>
        </Stack>

        <Table>
          <TableHead sx={{ background: "#1a237e" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Vendor
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Document Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Number
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Admin Comment
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.id || "N/A"}</TableCell>
                  <TableCell>{ doc.vendor?.contactPerson}<br/>{"(" + doc.vendor?.companyName + ")"|| "N/A"}</TableCell>
                  <TableCell>
                    {doc.documentName ||
                      doc.documentNumber ||
                      doc.documentType ||
                      "-"}
                  </TableCell>
                  <TableCell>
                    {doc.documentType ||
                      doc.documentName ||
                      doc.documentNumber ||
                      "-"}
                  </TableCell>
                  <TableCell>
                    {doc.documentNumber ||
                      doc.documentName ||
                      doc.documentType ||
                      "-"}
                  </TableCell>
                  <TableCell>
                    {editingId === doc.id ? (
                      <select
                        value={statusById[doc.id] || "PENDING"}
                        onChange={(e) =>
                          handleStatusChange(doc.id, e.target.value)
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    ) : (
                      <Chip
                        label={doc.status || "PENDING"}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          bgcolor:
                            doc.status === "ACCEPTED"
                              ? "#e8f5e9"
                              : doc.status === "REJECTED"
                                ? "#ffebee"
                                : "#e3f2fd",
                          color:
                            doc.status === "ACCEPTED"
                              ? "#2e7d32"
                              : doc.status === "REJECTED"
                                ? "#c62828"
                                : "#1565c0",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={commentById[doc.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(doc.id, e.target.value)
                      }
                      fullWidth
                      size="small"
                      placeholder="Add comment"
                      disabled={editingId !== doc.id}
                      sx={{
                        "& .MuiOutlinedInput-input:disabled": {
                          color: "#999",
                          WebkitTextFillColor: "#999",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {editingId === doc.id ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          size="small"
                          onClick={() => handleReview(doc.id)}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Save
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete document"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : doc.status && doc.status !== "PENDING" ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<EditIcon />}
                          size="small"
                          onClick={() => enterEditMode(doc.id, doc.status)}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Update
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete document"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<DoneIcon />}
                          size="small"
                          onClick={() => enterEditMode(doc.id, "ACCEPTED")}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          size="small"
                          onClick={() => enterEditMode(doc.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete document"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 4, color: "#777" }}
                >
                  No vendor documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
