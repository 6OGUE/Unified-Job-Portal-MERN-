import React, { useContext } from 'react';
import AdminNavbar from './AdminNavbar';
import EmployerNavbar from './EmployerNavbar';
import EmployeeNavbar from './EmployeeNavbar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext.jsx';

const NavbarWrapper = () => {
  const { role } = useContext(AuthContext); // <-- dynamic & reactive

  if (role === 'admin') return <AdminNavbar />;
  if (role === 'employer') return <EmployerNavbar />;
  if (role === 'employee') return <EmployeeNavbar />;
  return <Navbar />; // fallback
};

export default NavbarWrapper;
