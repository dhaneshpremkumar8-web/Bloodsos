import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Siren,
  Activity,
  Users,
  PlusCircle,
  Search,
  Mic,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  UserPlus,
  Zap,
  Droplet,
  Phone,
  MapPin,
  Heart,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import NotificationCard from '@/components/NotificationCard';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { mockDonors } from '@/data/mockData';
import {
  formatTimeAgo,
  classNames,
  getStageConfig,
  getUrgencyConfig,
  getInitials,
} from '@/utils/helpers';
import type { SOSRequest } from '@/types';

const quickActions = [
  { to: '/sos/create', label: 'Create SOS', icon: PlusCircle, color: 'bg-accent-600 hover:bg-accent-700' },
  { to: '/donors', label: 'Search Donors', icon: Search, color: 'bg-primary-600 hover:bg-primary-700' },
  { to: '/voice-sos', label: 'Voice SOS', icon: Mic, color: 'bg-info-600 hover:bg-info-700' },
  { to: '/sos', label: 'View SOS Board', icon: Siren, color: 'bg-success-600 hover:bg-success-700' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { sosRequests, notifications, markNotificationRead } = useSOS();

  // SOS created by this requester
  const mySOS = useMemo(
    () => sosRequests.filter((s) => s.requesterId === user?.id || s.requesterName === user?.name),
    [sosRequests, user]
  );

  const activeSOS = mySOS.filter((s) => s.stage !== 'completed' && s.stage !== 'cancelled');
  const completedSOS = mySOS.filter((s) => s.stage === 'completed');

  const stats = {
    totalSOS: mySOS.length,
    activeSOS: activeSOS.length,
    availableDonors: mockDonors.filter((d) => d.availability === 'available').length,
  };

  const userNotifications = notifications.filter(
    (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === 'recipient'
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening in your emergency blood network today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total SOS Requests"
          value={stats.totalSOS}
          icon={Siren}
          color="primary"
        />
        <DashboardCard
          title="Active Requests"
          value={stats.activeSOS}
          icon={Activity}
          color="accent"
        />
        <DashboardCard
          title="Available Donors"
          value={stats.availableDonors}
          icon={Users}
          color="success"
        />
        <DashboardCard
          title="Completed"
          value={completedSOS.length}
          icon={TrendingUp}
          color="info"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={classNames(
                'group flex items-center gap-4 rounded-xl p-4 text-white shadow-sm transition-all hover:shadow-md active:scale-95',
                action.color
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{action.label}</p>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

      {/* Active SOS with real status */}
      {activeSOS.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Your Active SOS Requests</h2>
          <div className="space-y-4">
            {activeSOS.map((sos) => (
              <ActiveSOSCard key={sos.id} sos={sos} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Notifications */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recent Notifications</h2>
          <Link to="/notifications" className="text-xs font-medium text-primary-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {userNotifications.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-gray-500">No notifications yet.</p>
            </div>
          ) : (
            userNotifications.slice(0, 4).map((notif) => (
              <NotificationCard key={notif.id} notification={notif} onMarkRead={markNotificationRead} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ActiveSOSCard({ sos }: { sos: SOSRequest }) {
  const stage = getStageConfig(sos.stage);
  const urgency = getUrgencyConfig(sos.urgency);

  return (
    <Link to={`/sos/${sos.id}`}>
      <div className="card card-hover p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
              <Droplet className="h-6 w-6 text-primary-600" fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge border border-primary-200 bg-primary-50 text-primary-700 font-bold">
                  {sos.bloodGroup}
                </span>
                <span className="text-sm text-gray-500">
                  {sos.unitsRequired} {sos.unitsRequired === 1 ? 'unit' : 'units'}
                </span>
              </div>
              <h3 className="mt-1 font-semibold text-gray-900">{sos.hospital}</h3>
              <p className="text-xs text-gray-400">{formatTimeAgo(sos.createdAt)}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className={classNames('badge border', urgency.classes)}>
              <span className={classNames('h-1.5 w-1.5 rounded-full', urgency.dot)} />
              {urgency.label}
            </span>
            <span className={classNames('badge', stage.classes)}>
              <span className={classNames('h-1.5 w-1.5 rounded-full', stage.dot)} />
              {stage.label}
            </span>
          </div>
        </div>

        {/* Donor accepted info */}
        {sos.acceptedDonor && sos.stage !== 'completed' && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-success-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100 text-xs font-bold text-success-700">
              {getInitials(sos.acceptedDonor.donorName)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-success-800">
                Donor found: {sos.acceptedDonor.donorName} ({sos.acceptedDonor.donorBloodGroup})
              </p>
              <p className="text-xs text-success-600">
                {sos.acceptedDonor.donorDistance} km away &middot; {formatTimeAgo(sos.acceptedDonor.respondedAt)}
              </p>
            </div>
            <a
              href={`tel:${sos.acceptedDonor.donorPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-success-600 p-2 text-white transition-colors hover:bg-success-700"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        )}

        {sos.stage === 'searching' && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700">
            <Clock className="h-4 w-4 animate-pulse" />
            Searching for compatible donors...
          </div>
        )}

        {sos.stage === 'completed' && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-success-100 p-3 text-sm font-medium text-success-800">
            <CheckCircle className="h-4 w-4" />
            SOS completed. Thank you to all donors!
          </div>
        )}
      </div>
    </Link>
  );
}
