import { useState } from 'react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import NotificationCard from '@/components/NotificationCard';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { classNames } from '@/utils/helpers';

type FilterTab = 'all' | 'unread' | 'read' | 'sos_alert';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSOS();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Filter notifications for the current user's role
  const userNotifications = notifications.filter(
    (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === user?.role
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const filteredNotifications = userNotifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    if (activeTab === 'sos_alert') return n.type === 'sos_alert';
    return true;
  });

  const tabs: { value: FilterTab; label: string; count?: number }[] = [
    { value: 'all', label: 'All', count: userNotifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read' },
    { value: 'sos_alert', label: 'SOS Alerts' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Stay updated on SOS alerts, donor responses, and system notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllNotificationsRead(user?.role)} className="btn-secondary text-sm">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <Bell className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{userNotifications.length}</p>
            <p className="text-xs text-gray-500">Total Notifications</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50">
            <Bell className="h-5 w-5 text-accent-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
            <p className="text-xs text-gray-500">Unread</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50">
            <Bell className="h-5 w-5 text-warning-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {userNotifications.filter((n) => n.type === 'sos_alert').length}
            </p>
            <p className="text-xs text-gray-500">SOS Alerts</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-thin">
        <Filter className="h-4 w-4 shrink-0 text-gray-400" />
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={classNames(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={classNames(
                'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold',
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Bell className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">No notifications here</p>
          <p className="mt-1 text-xs text-gray-400">
            {activeTab === 'unread' ? "You're all caught up!" : 'Check back later for updates.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} onMarkRead={markNotificationRead} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
