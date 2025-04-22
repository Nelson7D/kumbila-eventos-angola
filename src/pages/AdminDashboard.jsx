
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { withAdminProtection } from '@/contexts/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/components/admin/DashboardOverview';
import UsersManagement from '@/components/admin/UsersManagement';
import SpacesManagement from '@/components/admin/SpacesManagement';
import ReservationsManagement from '@/components/admin/ReservationsManagement';
import PaymentsManagement from '@/components/admin/PaymentsManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import AdminSettings from '@/components/admin/AdminSettings';

/**
 * Admin dashboard page component
 */
const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/spaces" element={<SpacesManagement />} />
        <Route path="/reservations" element={<ReservationsManagement />} />
        <Route path="/payments" element={<PaymentsManagement />} />
        <Route path="/reviews" element={<ReviewsManagement />} />
        <Route path="/logs" element={<AuditLogs />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default withAdminProtection(AdminDashboard);
