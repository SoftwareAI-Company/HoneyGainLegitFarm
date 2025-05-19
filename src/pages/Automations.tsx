// src/pages/Automations.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogPortal
} from '@/components/ui/dialog';

import AutomationWidget from '@/components/AutomationWidget';
import { YouTubeRunFarmModal } from '@/components/modals/YouTubeRunFarmModal';
import { HoneygainClaimPotModal } from '@/components/modals/HoneygainClaimPotModal';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';


const Automations = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('honeygain');
  const [isYouTubeModalOpen, setYouTubeModalOpen] = useState(false);
  const [isClaimPotModalOpen, setClaimPotModalOpen] = useState(false);
  // 1) estado de containers YouTube E ClaimPot
  const [ytRunningCount, setYtRunningCount] = useState(0);
  const [claimpotRunningCount, setclaimpotRunningCount] = useState(0);


  // Fetch all Docker containers via Electron
  const fetchContainers = async () => {
    try {
      return await (window as any).dockerAPI.listContainers();
    } catch {
      return [];
    }
  };

  // 2) função para recarregar o count
  const refreshYtCount = async () => {
    try {
      const list = await fetchContainers()
      const contextsyoutube = ['youtube']
      const farmsyoutube = list.filter(c => c.Names.some(name => contextsyoutube.some(ctx => name.startsWith(`/${ctx}_farm_`))))
      
      const contextsclaimpot = ['claimpot']
      const farmsclaimpot = list.filter(c => c.Names.some(name => contextsclaimpot.some(ctx => name.startsWith(`/${ctx}_farm_`))))
      
      const youtuberunningCount = farmsyoutube.filter(c => c.State === 'running').length
      const claimpotrunningCount = farmsclaimpot.filter(c => c.State === 'running').length

      setYtRunningCount(youtuberunningCount);
      setclaimpotRunningCount(claimpotrunningCount);
    } catch (err) {
      console.error('Erro ao checar YouTube containers', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível checar containers YouTube.',
        variant: 'destructive'
      });
    }
  };

  // 3) roda ao montar e sempre que o modal fecha
  useEffect(() => {
    refreshYtCount();
  }, []);

  const handleNewAutomation = () => {
    toast({
      title: 'New Automation',
      description: 'Your automation has been created successfully.',
    });
  };

  // 4) quando o modal fecha, refaz a contagem
  const handleYouTubeModalClose = (open: boolean) => {
    setYouTubeModalOpen(open);
    if (!open) {
      // modal fechou → kontêineres possivelmente alterados
      refreshYtCount();
    }
  };

  const handleClaimPotModalClose = (open: boolean) => {
    setClaimPotModalOpen(open);
    if (!open) {
      // aqui você poderia atualizar o status/progress se necessário
    }
  };

  // 5) define status e progress dinamicamente
  const ytStatus: 'active' | 'paused' = ytRunningCount >= 1 ? 'active' : 'paused';
  const ytProgress = ytRunningCount

  const claimpotStatus: 'active' | 'paused' = claimpotRunningCount >= 1 ? 'active' : 'paused';
  const claimpotProgress = claimpotRunningCount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Automations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-honeygain hover:bg-honeygain-dark text-black">
              <Plus className="h-4 w-4 mr-2" /> New Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-honeygain-card border-[#2d3749] text-honeygain-text">
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
              <DialogDescription className="text-honeygain-muted">
                Configure a new automation to manage your Honeygain or other services.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-honeygain-muted">
                Select the service and configure the automation parameters.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-[#2d3749] hover:bg-[#2d3749] text-honeygain-text">
                Cancel
              </Button>
              <Button
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleNewAutomation}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="honeygain"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-honeygain-card mb-4">
          <TabsTrigger value="ytdownload">Yt Download</TabsTrigger>
          <TabsTrigger value="honeygain">Claim Pot</TabsTrigger>
          <TabsTrigger value="steam">Steam Games</TabsTrigger>
        </TabsList>

        <TabsContent value="honeygain" className="space-y-4">
          <AutomationWidget
            title="Daily Reward Claim"
            description="Automatically claims your daily reward from Honeygain."
            status={claimpotStatus}
            progress={claimpotProgress}
            hidePercentSign={true}
            onConfigure={() => setClaimPotModalOpen(true)}
          />
          {/* Feature em breve */}
          {/* <AutomationWidget
            title="Content Delivery Monitor"
            description="Monitors and ensures content delivery is active."
            status="active"
            progress={75}
          /> */}
          {/* Feature em breve */}
          {/* <AutomationWidget
            title="Balance Tracker"
            description="Tracks your Honeygain balance and sends notifications."
            status="paused"
            progress={30}
          /> */}
          {/* Claim Pot Modal */}
          <HoneygainClaimPotModal
            open={isClaimPotModalOpen}
            onOpenChange={handleClaimPotModalClose}
          />
        </TabsContent>

        <TabsContent value="steam" className="space-y-4">
          <AutomationWidget
            title="Steam Download Cycle"
            description="Automatically download and uninstall Steam apps to generate traffic."
            status="active"
            progress={45}
          />
        </TabsContent>
        <TabsContent value="ytdownload" className="space-y-4">
          <AutomationWidget
            title="YouTube Download Cycle"
            description="Algorithm in docker, Download YouTube videos from a list to generate legitimate traffic"
            status={ytStatus}
            progress={ytProgress}
            hidePercentSign={true}
            onConfigure={() => setYouTubeModalOpen(true)}
          />

          {/* YouTube Modal */}
          <YouTubeRunFarmModal open={isYouTubeModalOpen} onOpenChange={handleYouTubeModalClose} />

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automations;
