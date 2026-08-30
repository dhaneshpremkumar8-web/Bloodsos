import { Link, useNavigate } from 'react-router-dom';
import { Droplet, LogOut, Bell, Heart, Siren } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { classNames } from '@/utils/helpers';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useSOS();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const count = user ? unreadCount(user.role) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={user ? (user.role === 'donor' ? '/donor' : '/dashboard') : '/'} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
            <Droplet className="h-5 w-5 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-gray-900">BloodSOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">AI</span>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className={classNames(
                'hidden items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:flex',
                user.role === 'donor'
                  ? 'bg-success-50 text-success-700'
                  : 'bg-accent-50 text-accent-700'
              )}
            >
              {user.role === 'donor' ? (
                <>
                  <Heart className="h-3 w-3" fill="currentColor" />
                  Donor
                </>
              ) : (
                <>
                  <Siren className="h-3 w-3" />
                  Requester
                </>
              )}
            </span>
            <Link
              to="/notifications"
              className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
