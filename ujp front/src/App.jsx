import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Employeereg from './components/Employeereg';
import Employerreg from './components/Employerreg';
import EmployerDashboard from './dashboard/EmployerDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Employeereg" element={<Employeereg />} />
        <Route path="/Employerreg" element={<Employerreg />} />
		<Route path="/employer-dashboard" element={<EmployerDashboard />} />
  <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
