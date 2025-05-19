import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NotificationsProvider } from '@/context/NotificationsContext';
import React from 'react';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <NotificationsProvider>
    <App />
  </NotificationsProvider>
);
// createRoot(document.getElementById("root")!).render(<App />);
