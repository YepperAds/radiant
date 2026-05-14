import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNewsPanel from './admin/AdminNewsPanel';
import AdminMarketPanel from './admin/Adminmarketpanel';
import AdminDashboard from './admin/AdminDashboard';
import AdminRegister from './auth/AdminRegister';
import AdminLogin from './auth/AdminLogin';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProjectedRoute';

function App() {
  return (
    <Routes>
      {/* Admin Routes - Protected */}
      <Route path="/register" element={<AdminRegister />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/news" 
        element={
          <ProtectedRoute>
            <AdminNewsPanel />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/market" 
        element={
          <ProtectedRoute>
            <AdminMarketPanel />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;