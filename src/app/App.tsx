// Main Application Component - Employee Management System

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from '@/app/store';
import { Toaster } from '@/app/components/ui/sonner';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import PrivateRoute from '@/app/components/PrivateRoute';

// Pages
import Login from '@/app/pages/Login';
import Dashboard from '@/app/pages/Dashboard';
import Employees from '@/app/pages/Employees';
import Departments from '@/app/pages/Departments';
import Attendance from '@/app/pages/Attendance';
import Leaves from '@/app/pages/Leaves';
import Payroll from '@/app/pages/Payroll';
import Reports from '@/app/pages/Reports';
import Layout from '@/app/components/Layout';

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login />} 
      />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}
