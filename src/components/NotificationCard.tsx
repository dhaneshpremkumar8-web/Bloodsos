import { Link } from 'react-router-dom';
import { Siren, UserPlus, CheckCircle, Search, Bell } from 'lucide-react';
import type { Notification } from '@/types';
import { classNames, formatTimeAgo } from '@/utils/helpers';

const iconMap = {
  sos_alert: { icon: Siren, classes: 'bg-accent-50 text-accent-600' },
  response: { icon: UserPlus, classes: 'bg-info-50 text-info-600' },
  system: { icon: Bell, classes: 'bg-gray-100 text-gray-600' },
  match_found: { icon: Search, classes: 'bg-success-50 text-success-600' },
};

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export default function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const config = iconMap[notification.type] ?? iconMap.system;
  const Icon = config.icon;

  return (
    <div
      className={classNames(
        'card card-hover flex items-start gap-3 p-4 animate-slide-in',
        !notification.read && 'border-primary-200 bg-primary-50/30'
      )}
    >
      <div className={classNames('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.classes)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</span>
          {notification.actionUrl && (
            <Link
              to={notification.actionUrl}
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              View &rarr;
            </Link>
          )}
          {!notification.read && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-600"
            >
              <CheckCircle className="h-3 w-3" />
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
