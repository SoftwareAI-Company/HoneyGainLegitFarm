// src/context/NotificationsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

interface NotificationsContextValue {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string) => void;
  clearNotifications: () => void;
}

const STORAGE_KEY = 'app_notifications';

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // carrega do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setNotifications(JSON.parse(stored));
    } catch {}
  }, []);

  // persiste no localStorage
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
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
