import React from 'react';
import AdminNavbar from './AdminNavbar';
import EmployerNavbar from './EmployerNavbar';
import EmployeeNavbar from './EmployeeNavbar';

const NavbarWrapper = () => {
  const role = localStorage.getItem('role');

  if (role === 'admin') return <AdminNavbar />;
  if (role === 'employer') return <EmployerNavbar />;
  if (role === 'employee') return <EmployeeNavbar />; // fallback if no role or unknown
};

export default NavbarWrapper;
