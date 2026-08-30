import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import DonorDashboardPage from '@/pages/DonorDashboardPage';
import DonorSearchPage from '@/pages/DonorSearchPage';
import DonorProfilePage from '@/pages/DonorProfilePage';
import SOSBoardPage from '@/pages/SOSBoardPage';
import CreateSOSPage from '@/pages/CreateSOSPage';
import SOSDetailsPage from '@/pages/SOSDetailsPage';
import VoiceSOSPage from '@/pages/VoiceSOSPage';
import NotificationsPage from '@/pages/NotificationsPage';
import HistoryPage from '@/pages/HistoryPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Requester routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="recipient">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donors"
        element={
          <ProtectedRoute role="recipient">
            <DonorSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donors/:id"
        element={
          <ProtectedRoute>
            <DonorProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos"
        element={
          <ProtectedRoute role="recipient">
            <SOSBoardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos/create"
        element={
          <ProtectedRoute role="recipient">
            <CreateSOSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos/:id"
        element={
          <ProtectedRoute>
            <SOSDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-sos"
        element={
          <ProtectedRoute role="recipient">
            <VoiceSOSPage />
          </ProtectedRoute>
        }
      />

      {/* Donor routes */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute role="donor">
            <DonorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <ProtectedRoute role="donor">
            <DonorProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Shared routes */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
