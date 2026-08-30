import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Siren,
  PlusCircle,
  Mic,
  Bell,
  Droplet,
  X,
  Heart,
  History,
  UserCircle,
} from 'lucide-react';
import { classNames } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const requesterNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/donors', label: 'Donor Search', icon: Search },
  { to: '/sos', label: 'SOS Board', icon: Siren },
  { to: '/sos/create', label: 'Create SOS', icon: PlusCircle },
  { to: '/voice-sos', label: 'Voice SOS', icon: Mic },
  { to: '/history', label: 'SOS History', icon: History },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

const donorNav = [
  { to: '/donor', label: 'Donor Dashboard', icon: LayoutDashboard },
  { to: '/donor/profile', label: 'My Profile', icon: UserCircle },
  { to: '/history', label: 'Donation History', icon: History },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isDonor = user?.role === 'donor';
  const navItems = isDonor ? donorNav : requesterNav;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={classNames(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
          <span className="font-display text-sm font-bold text-gray-900">Menu</span>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {isDonor ? 'Donor' : 'Requester'}
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames('sidebar-link', isActive && 'sidebar-link-active')
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="my-4 border-t border-gray-200" />

          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Emergency
          </div>
          {isDonor ? (
            <div className="rounded-lg bg-success-50 px-3 py-2.5 text-sm font-semibold text-success-700">
              <Heart className="mr-1 inline h-4 w-4" fill="currentColor" />
              Available to Help
            </div>
          ) : (
            <NavLink
              to="/sos/create"
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg bg-accent-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-700 hover:shadow-md active:scale-95',
                  isActive && 'ring-2 ring-accent-300'
                )
              }
            >
              <Siren className="h-5 w-5 shrink-0" />
              <span>Emergency SOS</span>
            </NavLink>
          )}
        </nav>

        <div className="mt-auto p-4">
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Droplet className="h-4 w-4 text-primary-600" fill="currentColor" />
              <span className="text-xs font-semibold text-primary-700">Did you know?</span>
            </div>
            <p className="text-xs text-gray-600">
              One donation can save up to 3 lives. Register as a donor today.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
