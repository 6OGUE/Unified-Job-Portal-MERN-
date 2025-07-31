import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import NavbarWrapper from './components/navbar/NavbarWrapper';
import Footer from './components/Footer';
import Home from './components/Home';
import Employeereg from './components/Employeereg';
import Employerreg from './components/Employerreg';
import EmployerDashboard from './dashboard/EmployerDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import EmployeeView from './components/admin/EmployeeView';
import EmployerView from './components/admin/EmployerView';
import PostJob from './components/employer/post-job.jsx';
import MyJobs from './components/employer/Myjobs.jsx'; // Added this import

import ViewProfile from './components/employee/ViewProfile';
import EditProfile from './components/employee/EditProfile';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Employeereg" element={<Employeereg />} />
          <Route path="/Employerreg" element={<Employerreg />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

          <Route path="/employee/profile" element={<ViewProfile />} />
          <Route path="/employee/profile/edit" element={<EditProfile />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeView />} />
          <Route path="/admin/employers" element={<EmployerView />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/employer/my-jobs" element={<MyJobs />} /> {/* Added this route */}
        </Routes>
        {/* You might want to include Footer here if it's meant to be on all pages */}
        {/* <Footer /> */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
