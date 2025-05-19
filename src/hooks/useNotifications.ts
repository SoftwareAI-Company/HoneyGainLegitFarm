// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = 'app_notifications';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setNotifications(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const addNotification = (title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // keep last 10
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return { notifications, addNotification, clearNotifications };
}
