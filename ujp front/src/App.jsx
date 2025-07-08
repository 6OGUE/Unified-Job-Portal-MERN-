import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Employeereg from './components/Employeereg';
import Employerreg from './components/Employerreg';

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
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
