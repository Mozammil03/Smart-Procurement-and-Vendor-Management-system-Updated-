import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Home from "../pages/Home";
import { setGlobalNavigate } from "../utils/navigation";
import Login from "../pages/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import FinanceDashboard from "../pages/finance/FinanceDashboard";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import ViewPurchaseOrders from "../pages/vendor/ViewPurchaseOrders";
 import UploadDocuments from "../pages/vendor/UploadDocuments";

import  SubmitInvoice from "../pages/vendor/SubmitInvoice";
 import VendorRatings from "../pages/vendor/VendorRatings";


 import Delivery from "../pages/vendor/Delivery";
import  ViewInvoices from "../pages/finance/ViewInvoices";

import   PurchaseOrders from "../pages/finance/PurchaseOrders";

import   ApprovedRequests from "../pages/manager/ApprovedRequests";
import   PendingApprovals from "../pages/manager/PendingApprovals";

import  ViewPayments  from "../pages/finance/ViewPayments";

import Roles from '../pages/master/Roles';
import Departments from '../pages/master/Departments';
import Users from '../pages/master/Users';
import Items from '../pages/admin/Items';
import PurchaseOrder from '../pages/admin/PurchaseOrder';
import Inventory from "../pages/admin/Inventory";
import CreateRequisition from '../pages/employee/CreateRequisition';
import MyRequisitions from '../pages/employee/MyRequisitions';
import TrackStatus from '../pages/employee/TrackStatus';
import VendorRegister from "../pages/vendor-register/VendorRegister";

import VendorApproval from "../pages/admin/VendorApproval";
import AdminVendorRatings from "../pages/admin/AdminVendorRatings";
import AdminVendorDocuments from "../pages/admin/AdminVendorDocuments";
import NotAuthorized from "../pages/NotAuthorized";

import ProtectedRoute from "../components/ProtectedRoute";
import  ProcessPayment from "../pages/finance/ProcessPayment";
import  Reports from "../pages/finance/Reports";

function RouterContent() {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
<Route path="/" element={<Home />} />

<Route path="/employee" element={<EmployeeDashboard />} />
<Route path="/employee/dashboard" element={<EmployeeDashboard />} />
<Route path="/employee/create-requisition" element={<CreateRequisition />} />
<Route path="/employee/my-requisitions" element={<MyRequisitions />} />
<Route path="/employee/track-status" element={<TrackStatus />} />

<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<></>} />
  <Route path="roles" element={<Roles />} />
  <Route path="departments" element={<Departments />} />
  <Route path="users" element={<Users />} />
  <Route path="items" element={<Items />} />
  <Route path="PurchaseOrder" element={<PurchaseOrder />} />
  <Route path="Inventory" element={<Inventory />} />
  <Route path="VendorApproval" element={<VendorApproval />} />
  <Route path="vendor-ratings" element={<AdminVendorRatings />} />
  <Route path="vendor-documents" element={<AdminVendorDocuments />} />
</Route>

<Route path="/finance" element={<FinanceDashboard />} />
{/* <Route path="/employee/requisition" element={<CreateRequisition/>}/> */}
<Route path="/pages/vendor-register/VendorRegister" element={<VendorRegister />} />
<Route path="/VendorApproval" element={<VendorRegister />} />






<Route
  path="/vendor"
  element={
    <ProtectedRoute allowedRoles={["VENDOR"]}>
      <VendorDashboard />
    </ProtectedRoute>
  }
>
  <Route path="ViewPurchaseOrders" element={<ViewPurchaseOrders />} />
  <Route path="UploadDocuments" element={<UploadDocuments />} />
  <Route path="SubmitInvoice" element={<SubmitInvoice />} />
  <Route path="VendorRatings" element={<VendorRatings />} />
</Route>


<Route
  path="/finance"
  element={
    <ProtectedRoute allowedRoles={["FINANCE"]}>
      <FinanceDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="invoices" replace />} />
  <Route path="invoices" element={<ViewInvoices  />} />
  <Route path="payments" element={<ViewPayments />} />
    <Route path="process-payment" element={<ProcessPayment />} />
    <Route path="purchase-orders" element={<PurchaseOrders />} />
   
        <Route path="reports" element={<Reports />} />
</Route>




<Route
  path="/manager"
  element={
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <ManagerDashboard />
    </ProtectedRoute>
  }
>
  <Route path="pending" element={<PendingApprovals />} />
  <Route path="approved" element={<ApprovedRequests />} />
</Route>


















    {/* Vendor Dashboard */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        >

          {/* Default Page */}
          <Route index element={<Navigate to="purchase-orders" replace />} />

          <Route path="purchase-orders" element={<ViewPurchaseOrders />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="submit-invoice" element={<SubmitInvoice />} />
          <Route path="upload-documents" element={<UploadDocuments />} />
          <Route path="ratings" element={<VendorRatings />} />
        </Route>
        <Route path="/notauthorized" element={<NotAuthorized />} />
      </Routes>
    );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}

export default AppRouter;
