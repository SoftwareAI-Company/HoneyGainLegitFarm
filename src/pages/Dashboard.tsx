// src\pages\Dashboard.tsx
import { useState, useEffect, useRef  } from 'react';
import BalanceCard from '../components/cards/BalanceCard';
import ActivityCard from '../components/cards/ActivityCard';
import StatusCard from '../components/cards/StatusCard';
import TrafficChart from '../components/charts/TrafficChart';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { fetchBalances, fetchTrafficStats } from '@/services/api';
import { Progress } from '@/components/ui/progress';
import { useSettings } from '@/hooks/use-settings'; 
import { useNotifications } from '@/context/NotificationsContext';
import { useNavigate } from 'react-router-dom';

type Period = 'today' | 'week' | 'month';
interface BalanceData {
  realtime: { credits: number; usd_cents: number };
  payout:   { credits: number; usd_cents: number };
  min_payout: { credits: number; usd_cents: number };
}


const Dashboard = () => {
  const [status, setStatus] = useState<"active" | "paused" | "queue">("active");
  const { toast } = useToast();
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [farmCount, setFarmCount] = useState(0);
  const [period, setPeriod] = useState<Period>('today');
  const [trafficOnlyGB, setTrafficOnlyGB] = useState<Array<{ value: number }>>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const { notificationsEnabled, setNotificationsEnabled } = useSettings();
  const lastUsdCents = useRef<number | null>(null);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const { farmEnabled, setFarmEnabled, autoStart } = useSettings();
  const [enabled, setEnabled] = useState(farmEnabled);   // inicia de settings

  // Fetch balances
  const loadBalances = async () => {
    setIsLoadingBalance(true);
    try {
      const data = await fetchBalances();
      const prev = lastUsdCents.current ?? data.realtime.usd_cents;
      const curr = data.realtime.usd_cents;

      // Só notificamos se enabled e subiu ≥ 1 cent
      if (notificationsEnabled && curr - prev >= 1) {
        // adiciona na lista compartilhada
        addNotification(
          'YouTube Download Cycle: Balance increased',
          `+$${((curr - prev) / 100).toFixed(2)}`
        );
        // dispara notificação nativa
        if (Notification.permission === 'granted') {
          new Notification('Honeygain Legit Farm', {
            body: `YouTube Download Cycle: Your balance increased by $${((curr - prev) / 100).toFixed(2)}!`
          });
        }
      }

      lastUsdCents.current = curr;
      
      setBalanceData({
        realtime: { credits: data.realtime.credits, usd_cents: data.realtime.usd_cents },
        payout:   { credits: data.payout.credits,   usd_cents: data.payout.usd_cents },
        min_payout: { credits: data.min_payout.credits || 1, usd_cents: data.min_payout.usd_cents }
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Unable to load balances.', variant: 'destructive' });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch traffic stats and convert bytes to GB
  const loadTrafficAndChart = async () => {
    setIsLoadingTraffic(true);
    try {
      const res = await fetchTrafficStats();
      // Note: API returns field 'traffic', not 'gathering_bytes'
      const stats = Array.isArray(res.traffic_stats) ? res.traffic_stats : [];

      const formatted = stats.map(item => {
        const dateObj = new Date(item.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          date: dateStr,
          value: parseFloat((item.traffic / 1e9).toFixed(3))
        };
      });
      setChartData(formatted);
    } catch (err) {
      console.error('Failed to fetch traffic stats', err);
      toast({ title: 'Error', description: 'Unable to load traffic data.', variant: 'destructive' });
    } finally {
      setIsLoadingTraffic(false);
    }
  };
  // Fetch traffic stats only GB
  const loadTrafficOnlyGB = async () => {
    // isLoadingTraffic(true);
    try {
      const { traffic_stats } = await fetchTrafficStats();
      const formatted = traffic_stats.map(item => {
        return {
          value: parseFloat((item.traffic / 1e9).toFixed(3))
        };
      });
      setTrafficOnlyGB(formatted);
    } catch (err) {
      console.error('Failed to fetch traffic stats', err);
      toast({ title: 'Error', description: 'Unable to load traffic data.', variant: 'destructive' });
    } finally {
      // setTrafficOnlyGB(false);
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Balance + notificações
  useEffect(() => {
    loadBalances();
    const id = setInterval(loadBalances, 60_000);
    return () => clearInterval(id);
  }, [notificationsEnabled]);

  // Tráfego
  useEffect(() => {
    loadTrafficAndChart();
    loadTrafficOnlyGB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Calculate traffic based on selected period
  const getTrafficForPeriod = (p: Period) => {
    if (trafficOnlyGB.length === 0) return 0;
    switch(p) {
      case 'today':
        // last entry
        return trafficOnlyGB[trafficOnlyGB.length - 1].value;
      case 'week':
        // sum of last 7 days
        return trafficOnlyGB.slice(-7).reduce((sum, item) => sum + item.value, 0);
      case 'month':
        // sum of all
        return trafficOnlyGB.reduce((sum, item) => sum + item.value, 0);
    }
  };

  // Fetch all Docker containers via Electron
  const fetchContainers = async () => {
    try {
      return await (window as any).dockerAPI.listContainers();
    } catch {
      return [];
    }
  };


  // Determine service status
  const checkServiceStatus = async () => {
    const list = await fetchContainers();
    const contexts = ['youtube','steam','claimpot'];
    const farms = list.filter(c => c.Names.some(n => contexts.some(ctx => n.startsWith(`/${ctx}_farm_`))));
    const running = farms.filter(c => c.State === 'running').length;
    setFarmCount(running);
    const newEnabled = running > 0;
    setEnabled(newEnabled);
    setFarmEnabled(newEnabled);
    setStatus(newEnabled ? 'active' : 'paused');
  };


  // Start all farm_ containers that are not running
  const startFarmContainers = async () => {
    setStatus('queue');
    const list = await fetchContainers();
    const toStart = list.filter(c =>
      c.Names.some(name => name.includes('farm_')) && c.State !== 'running'
    );
    for (const container of toStart) {
      await (window as any).dockerAPI.startContainer(container.Id);
    }
    setStatus('active');
    toast({ title: 'Activated', description: 'Farm containers started.' });
    await checkServiceStatus();
  };

  // Stop all farm_ containers that are running
  const stopFarmContainers = async () => {
    setStatus('queue');

    // 1) Busca a lista atual de containers
    const list = await fetchContainers();

    // 2) Filtra os que têm 'farm_' no nome e estão rodando
    const toStop = list.filter(c =>
      c.Names.some(name => name.includes('farm_')) && c.State === 'running'
    );

    // 3) Para cada um
    for (const container of toStop) {
      await (window as any).dockerAPI.stopContainer(container.Id);
    }

    // 4) Garantir que a Docker API já reflita o novo estado
    await fetchContainers();

    // 5) Só aí exibe o toast
    toast({ title: 'Paused', description: 'Farm containers stopped.' });

    // 6) Recalcula status usando a lista já atualizada
    await checkServiceStatus();
  };


  // Toggle service active/paused, with redirect if no farm containers exist
  const handleToggle = async () => {
    const list = await fetchContainers();
    if (list.filter(c => c.Names.some(n => n.includes('farm_'))).length === 0) {
      toast({ title: 'No Farm Containers', description: 'Redirecting...', variant: 'destructive' });
      navigate('/automations?tab=farm'); return;
    }
    enabled ? await stopFarmContainers() : await startFarmContainers();
  };



  // Auto-start on mount
  useEffect(() => {
    (async () => {
      await checkServiceStatus();
      if (autoStart && farmCount > 0 && !enabled) {
        await startFarmContainers();
      }
    })();
  }, []);

  // Initialize on mount
  useEffect(() => {
    checkServiceStatus();
  }, []);

  const handlePayoutRequest = () => {
    toast({
      title: "Payout Requested",
      description: "Your payout request has been submitted successfully.",
    });
  };

  // Calculate payout progress percentage
  const calculatePayoutPercentage = () => {
    if (!balanceData) return 0;
    const current  = balanceData.payout?.credits    ?? 0;
    const required = balanceData.min_payout?.credits ?? 20;
    return Math.min(Math.round((current / required) * 100), 100);
  };
  const payoutPercentage = calculatePayoutPercentage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Device overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <BalanceCard
                title="Honey Earned Today"
                balance={balanceData?.realtime.credits ?? 0}
                unit="credits"
              />
              <BalanceCard
                title="Value Earned Today"
                balance={balanceData?.realtime.usd_cents ?? 0}
                unit="cents"
                className="border-t-0 rounded-t-none"
              />
              <BalanceCard
                title="Containers Running"
                balance={farmCount}
                unit="int"
                className="border-t-0 rounded-t-none"
              />

            </div>
            <div>
              <StatusCard status={status} enabled={enabled} onToggle={handleToggle} />
            </div>
          </div>
          <TrafficChart
            title="The graph shows your GB stats for the last 30 days"
            data={chartData}
            loading={isLoadingTraffic}
            className="h-full"
          />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Tabs value={period} onValueChange={val => setPeriod(val as Period)} className="w-full">
          <TabsList className="grid grid-cols-3 bg-honeygain-card">
            <TabsTrigger value="today">Earned today</TabsTrigger>
            <TabsTrigger value="week">Last 7 days</TabsTrigger>
            <TabsTrigger value="month">Last 30 days</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <BalanceCard
              title="Credits Honey Earned"
              balance={balanceData?.realtime.credits ?? 0}
              unit="credits"
              className="border-t-0 rounded-t-none"
              
            />
          </TabsContent>
          <TabsContent value="week">
            <BalanceCard
              title="Credits Honey Earned"
              balance={chartData.slice(-7).reduce((sum, s) => sum + s.value, 0)}
              unit="credits"
              className="border-t-0 rounded-t-none"
              
            />
          </TabsContent>
          <TabsContent value="month">
            <BalanceCard
              title="Credits Honey Earned"
              balance={chartData.reduce((sum, s) => sum + s.value, 0)}
              unit="credits"
              className="border-t-0 rounded-t-none"
            />
          </TabsContent>
        </Tabs>

        <ActivityCard
          title="Gathering"
          icon="gathering"
          value={getTrafficForPeriod(period)}
          unit="GB"
          className="h-full"
        />
        <ActivityCard
          title="Content Delivery"
          icon="delivery"
          value={Math.round(getTrafficForPeriod(period) / 60)}
          unit="min"
          className="h-full"
        />
      </div>
    </div>
  );
};

// Import locally since this component is used only in this file
const HoneycombIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 19.5L4.5 15.4605V7.5395L12 3.5L19.5 7.5395V15.4605L12 19.5ZM12 16.731L17.25 13.866V9.134L12 6.269L6.75 9.134V13.866L12 16.731Z" />
  </svg>
);

// Import locally since this component is used only in this file
const HoneygainLogo = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FFB100"/>
    <path d="M15.9 7.5C15.4029 7.5 15 7.94772 15 8.5C15 9.05228 15.4029 9.5 15.9 9.5C16.3971 9.5 16.8 9.05228 16.8 8.5C16.8 7.94772 16.3971 7.5 15.9 7.5Z" fill="#121212"/>
    <path d="M12 6C9.79086 6 8 7.79086 8 10V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10V14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14V10C10 8.89543 10.8954 8 12 8Z" fill="#121212"/>
  </svg>
);

export default Dashboard;
