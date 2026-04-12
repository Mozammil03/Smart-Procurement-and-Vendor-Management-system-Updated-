import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
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

import ProtectedRoute from "../components/ProtectedRoute";
import  ProcessPayment from "../pages/finance/ProcessPayment";
import  Reports from "../pages/finance/Reports";

import { Navigate } from "react-router-dom";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/master/roles" element={<Roles/>} />
<Route path="/master/departments" element={<Departments/>} />
<Route path="/master/users" element={<Users/>} />

 {/* <Route path="/" element={<Login />} /> */}



<Route path="/login" element={<Login />} />
<Route path="/" element={<Home />} />


<Route path="/employee" element={<EmployeeDashboard />} />
<Route path="/employee/dashboard" element={<EmployeeDashboard />} />
<Route path="/employee/create-requisition" element={<CreateRequisition />} />
<Route path="/employee/my-requisitions" element={<MyRequisitions />} />
<Route path="/employee/track-status" element={<TrackStatus />} />
 {/* <Route path="/employee" element={<EmployeeDashboard />} /> */}
    <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />
          {/* <Route path="/employee/requisition" element={<CreateRequisition/>}/> */}
         <Route path="/admin/items" element={<Items/>} />

       <Route path="/admin/PurchaseOrder" element={<PurchaseOrder />} />
    <Route path="/admin/Inventory" element={<Inventory />} />

            <Route path="/pages/vendor-register/VendorRegister" element={<VendorRegister />} />
   

        <Route path="/VendorApproval" element={<VendorRegister />} />
        <Route
  path="/admin/VendorApproval"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <VendorApproval />
    </ProtectedRoute>
  }
/>






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
 </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
