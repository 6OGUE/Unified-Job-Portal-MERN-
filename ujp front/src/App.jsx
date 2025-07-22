import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import NavbarWrapper from './components/navbar/NavbarWrapper'; // ✅ dynamic navbar
import Footer from './components/Footer';
import Home from './components/Home';
import Employeereg from './components/Employeereg';
import Employerreg from './components/Employerreg';
import EmployerDashboard from './dashboard/EmployerDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import EmployeeView from './components/admin/EmployeeView';
import EmployerView from './components/admin/EmployerView';
// Import post job with a valid variable name
import PostJob from './components/employer/post-job.jsx';

function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper /> {/* ✅ dynamic navbar goes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Employeereg" element={<Employeereg />} />
        <Route path="/Employerreg" element={<Employerreg />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeeView />} />
        <Route path="/admin/employers" element={<EmployerView />} />
        {/* Use uppercase component name */}
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
