import { useEffect, useState } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState<
    { id: string; type: string; title: string; message: string; read: boolean; createdAt: string; actionUrl?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/services/api').then(({ notificationService }) => {
      notificationService.getNotifications().then((n) => {
        setNotifications(n);
        setLoading(false);
      });
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead };
}
