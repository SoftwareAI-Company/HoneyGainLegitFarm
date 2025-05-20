// src/hooks/use-settings.ts
import { useState, useEffect } from 'react';

interface SettingsState {
  notificationsEnabled: boolean;
  darkMode: boolean;
  autoStart: boolean;
  farmEnabled: boolean;
}

const LOCAL_STORAGE_KEY = 'app_settings';

// Load settings from localStorage or return defaults
function loadSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SettingsState;
    }
  } catch {
    // ignore parse errors
  }
  return {
    notificationsEnabled: true,
    darkMode: true,
    autoStart: false,
    farmEnabled: false,  // padrão 
  };
}

// Hook to manage persistent settings
export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore write errors
    }
  }, [settings]);

  // Individual setters
  const setNotificationsEnabled = (value: boolean) => {
    setSettings(prev => ({ ...prev, notificationsEnabled: value }));
  };

  const setDarkMode = (value: boolean) => {
    setSettings(prev => ({ ...prev, darkMode: value }));
  };

  const setAutoStart = (value: boolean) => {
    setSettings(prev => ({ ...prev, autoStart: value }));
  };

  // New setter for farmEnabled
  const setFarmEnabled = (value: boolean) => {
    setSettings(prev => ({ ...prev, farmEnabled: value }));
  };

  return {
    notificationsEnabled: settings.notificationsEnabled,
    darkMode: settings.darkMode,
    autoStart: settings.autoStart,
    farmEnabled: settings.farmEnabled,
    setNotificationsEnabled,
    setDarkMode,
    setAutoStart,
    setFarmEnabled,
  };
}
