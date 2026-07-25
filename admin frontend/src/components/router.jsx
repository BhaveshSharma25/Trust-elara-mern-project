import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import CategoryDashboard from "../pages/CategoryDashboard";
import CategoryCreate from "../pages/CategoryCreate";
import CategoryEdit from "../pages/CategoryEdit";
import ServiceManagement from "../pages/ServiceManagement";
import ServiceCreate from "../pages/ServiceCreate";
import ServiceEdit from "../pages/ServiceEdit";
import CustomerList from "../pages/CustomerList";
import OrderList from "../pages/OrderList";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/practice1" element={<CategoryDashboard />} />
      <Route path="/category/create" element={<CategoryCreate />} />
      <Route path="/category/edit/:id" element={<CategoryEdit />} />
      <Route path="/services" element={<ServiceManagement />} />
      <Route path="/services/create" element={<ServiceCreate />} />
      <Route path="/services/edit/:id" element={<ServiceEdit />} />
      <Route path="/customers" element={<CustomerList />} />
      <Route path="/orders" element={<OrderList />} />
    </Routes>
  );
}

export default Routing;
