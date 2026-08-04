import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNewsPanel from './admin/AdminNewsPanel';
import AdminMarketPanel from './admin/Adminmarketpanel';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsersPanel from './admin/AdminUsersPanel';
import AdminConversationsPanel from './admin/AdminConversationsPanel';
import AdminHistoryPanel from './admin/AdminHistoryPanel';
import AdminBulkImportPanel from './admin/AdminBulkImportPanel';
import AdminDangerZonePanel from './admin/AdminDangerZonePanel';
import AdminRegister from './auth/AdminRegister';
import AdminLogin from './auth/AdminLogin';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProjectedRoute';
 
function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/register" element={<AdminRegister />} />
      <Route path="/login"    element={<AdminLogin />} />

      {/* Admin — Protected */}
      <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/news"          element={<ProtectedRoute><AdminNewsPanel /></ProtectedRoute>} />
      <Route path="/admin/market"        element={<ProtectedRoute><AdminMarketPanel /></ProtectedRoute>} />
      <Route path="/admin/users"         element={<ProtectedRoute><AdminUsersPanel /></ProtectedRoute>} />
      <Route path="/admin/conversations" element={<ProtectedRoute><AdminConversationsPanel /></ProtectedRoute>} />
      <Route path="/admin/history"       element={<ProtectedRoute><AdminHistoryPanel /></ProtectedRoute>} />
      <Route path="/admin/bulk-import"   element={<ProtectedRoute><AdminBulkImportPanel /></ProtectedRoute>} />
      <Route path="/admin/danger-zone"   element={<ProtectedRoute><AdminDangerZonePanel /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;