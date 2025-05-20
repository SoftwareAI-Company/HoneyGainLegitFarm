// src\App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Automations from "./pages/Automations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Metrics from '@/pages/Metrics';
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  }
});

const App = () => {
  // const { addNotification } = useNotifications();

  // useEffect(() => {
  //   if ('Notification' in window && Notification.permission === 'default') {
  //     Notification.requestPermission();
  //   }
  //   addNotification('🔔 Test Notification', 'This is just a test at startup.');
  //   if (Notification.permission === 'granted') {
  //     new Notification('Honeygain Automator', {
  //       body: 'This is just a test at startup.',
  //     });
  //   }
  // }, [addNotification]);

  return (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* Rota pai única */}
          <Route path="/" element={<Layout />}>
            {/* Página inicial como rota index */}
            {/* <Route element={<Index />} /> */}

            {/* Demais páginas */}
            <Route index path="dashboard" element={<Dashboard />} />
            <Route path="automations" element={<Automations />} />
            <Route path="settings" element={<Settings />} />
            <Route path="metrics" element={<Metrics />} />

            {/* Qualquer outra URL cai no NotFound */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </TooltipProvider>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
  </QueryClientProvider>
);
}
export default App;
