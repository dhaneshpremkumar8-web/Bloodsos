import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FullPageSpinner } from '@/components/Spinner';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return <FullPageSpinner label="Verifying access..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // Redirect to the correct dashboard for their role
    return <Navigate to={user.role === 'donor' ? '/donor' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
