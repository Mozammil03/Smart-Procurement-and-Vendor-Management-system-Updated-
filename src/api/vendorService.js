// import axios from "axios";

// const BASE_URL = "http://localhost:8097";

// //  View Purchase Orders
// export const getVendorPOs = (vendorId) => {
//   return axios.get(`${BASE_URL}/po/vendor/${vendorId}`);
// };

// //  Upload Documents
// export const uploadDocument = (data) => {
//   return axios.post(`${BASE_URL}/api/vendor-documents`, data);
// };

// //  Submit Invoice
// export const submitInvoice = (data) => {
//   return axios.post(`${BASE_URL}/invoices`, data);
// };

// //  View Ratings
// export const getVendorRatings = (vendorId) => {
//   return axios.get(`${BASE_URL}/api/vendor-ratings/vendor/${vendorId}`);
// };


import api from "./axios";

export const uploadDocument = (data) => {
  return api.post("/api/vendor-documents", data);
};

export const getVendorDocuments = ({ vendorId, vendorName } = {}) => {
  return api.get("/api/vendor-documents", { params: { vendorId, vendorName } });
};

export const deleteVendorDocument = (documentId) => {
  return api.delete(`/api/vendor-documents/${documentId}`);
};

export const reviewVendorDocument = (documentId, payload) => {
  return api.put(`/api/vendor-documents/${documentId}/review`, payload);
};

export const createDelivery = (data) => {
  return api.post("/api/deliveries", data);
};

export const getDeliveries = () => {
  return api.get("/api/deliveries");
};

export const submitInvoice = (data) => {
  return api.post("/invoice", data);
};

export const getVendorRatings = (vendorId) => {
  return api.get(`/api/vendor-ratings/vendor/${vendorId}`);
};

export const getAdminVendorRatings = () => {
  return api.get(`/api/vendor-ratings/admin/ratings`);
};

export const createAdminVendorRating = (payload) => {
  return api.post(`/api/vendor-ratings/admin/rate`, payload);
};

export const deleteVendorRatings = (vendorId) => {
  return api.post(`/api/vendor-ratings/admin/delete/${vendorId}`);
};

export const getVendorPOs = (vendorId) => {
  return api.get(`/po?vendorId=${vendorId}`);
};