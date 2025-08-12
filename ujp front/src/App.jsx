import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import NavbarWrapper from './components/navbar/NavbarWrapper';
import Home from './components/Home';
import Employeereg from './components/Employeereg';
import Employerreg from './components/Employerreg';
import EmployerDashboard from './dashboard/EmployerDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import EmployeeView from './components/admin/EmployeeView';
import EmployerView from './components/admin/EmployerView';
import PostJob from './components/employer/post-job.jsx';
import MyJobs from './components/employer/Myjobs.jsx';
import ViewProfile from './components/employee/ViewProfile';
import EditProfile from './components/employee/EditProfile';
import ViewJobs from './components/employee/ViewJobs.jsx';
import AllApplicationsTable from './components/employer/AllApplicationsTable.jsx';
import UserProfile from './components/employer/UserProfile.jsx';
import { AuthProvider } from './context/AuthContext';
import ApplicationHistory from './components/employee/history';
import RoleBasedHome from './components/RoleBasedHome';

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
                    <Route path="/employee/viewjobs" element={<ViewJobs />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/employees" element={<EmployeeView />} />
                    <Route path="/admin/employers" element={<EmployerView />} />
                    <Route path="/post-job" element={<PostJob />} />
                    <Route path="/employer/my-jobs" element={<MyJobs />} />
                    <Route path="/employer/all-applications" element={<AllApplicationsTable />} />
                    
                    {/* --- THIS IS THE ONLY CORRECTED LINE --- */}
                    <Route path="/user/:id/:applicationId" element={<UserProfile />} />

                    <Route path="/employee/applications" element={<ApplicationHistory />} />
                    <Route path="/home" element={<RoleBasedHome />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;