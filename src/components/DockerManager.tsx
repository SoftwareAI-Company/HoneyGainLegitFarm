// src/components/DockerManager.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface ContainerInfo {
  Id: string;
  Names: string[];
  State: string;
  Status: string;
}

interface DockerManagerProps {
  context?: string;
}

export function DockerManager({ context }: DockerManagerProps) {
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [busyContainer, setBusyContainer] = useState<string | null>(null);

  // prefix for container names
  const prefix = context ? `${context}_farm_` : 'farm_';
  // choose image based on context
  const imageTag =
    context === 'youtube'
    ? 'mediacutstudio/ytdownloadautomation:latest'
    : context === 'claimpot'
    ? 'mediacutstudio/honeygainclaimpotautomation:latest'
    : 'mediacutstudio/honeygainlegitfarm:latest';

  const refresh = async () => {
    setLoading(true);
    try {
      const list: ContainerInfo[] = await (window as any).dockerAPI.listContainers();
      // filter by prefix
      const filtered = list.filter(c =>
        c.Names.some(name => name.startsWith(`/${prefix}`))
      );
      setContainers(filtered);
    } catch (err) {
      console.error('Error listing containers:', err);
      toast({ title: 'Error', description: 'Unable to list containers.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const pullImage = async () => {
    setPulling(true);
    try {
      await (window as any).dockerAPI.pullImage(imageTag);
      toast({ title: 'Image Pulled', description: `${imageTag} downloaded`, variant: 'default' });
      await refresh();
    } catch (err) {
      console.error('Error pulling image:', err);
      toast({ title: 'Error', description: 'Failed to download image.', variant: 'destructive' });
    } finally {
      setPulling(false);
    }
  };

  const spinUp = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('honeygain_email') || '';
      const pass = localStorage.getItem('honeygain_pass') || '';
      const envVars = [`HONEYGAIN_EMAIL=${email}`, `HONEYGAIN_PASS=${pass}`];
      const hostPath = await (window as any).dockerAPI.getAppPath();
      for (let i = 0; i < count; i++) {
        const name = `${prefix}${Date.now()}_${i}`;
        await (window as any).dockerAPI.createContainer({
          imageTag,
          name,
          memLimit: 500 * 1024 * 1024,
          cpus: 1.25,
          binds: [`${hostPath}/Keys:/app/Keys`],
          envVars,
        });
      }
      toast({ title: 'Containers Created', description: `${count} containers started`, variant: 'default' });
      await refresh();
    } catch (err) {
      console.error('Error creating containers:', err);
      toast({ title: 'Error', description: 'Failed to create containers.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const stopContainer = async (id: string) => {
    setBusyContainer(id);
    setLoading(true);
    try {
      await (window as any).dockerAPI.stopContainer(id);
      toast({ title: 'Stopped', description: `Container ${id} stopped`, variant: 'default' });
      await refresh();
    } catch (err) {
      console.error('Error stopping container:', err);
      toast({ title: 'Error', description: 'Failed to stop container.', variant: 'destructive' });
    } finally {
      setLoading(false);
      setBusyContainer(null);
    }
  };

  const startContainer = async (id: string) => {
    setBusyContainer(id);
    setLoading(true);
    try {
      await (window as any).dockerAPI.startContainer(id);
      toast({ title: 'Started', description: `Container ${id} started`, variant: 'default' });
      await refresh();
    } catch (err) {
      console.error('Error starting container:', err);
      toast({ title: 'Error', description: 'Failed to start container.', variant: 'destructive' });
    } finally {
      setLoading(false);
      setBusyContainer(null);
    }
  };

  const deleteContainer = async (id: string) => {
    setBusyContainer(id);
    setLoading(true);
    try {
      await (window as any).dockerAPI.removeContainer(id);
      toast({ title: 'Deleted', description: `Container ${id} removed`, variant: 'default' });
      await refresh();
    } catch (err) {
      console.error('Error deleting container:', err);
      toast({ title: 'Error', description: 'Failed to delete container.', variant: 'destructive' });
    } finally {
      setLoading(false);
      setBusyContainer(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          disabled={loading || pulling}
          className="bg-honeygain-card text-honeygain-text"
        />
        <Button onClick={pullImage} disabled={pulling}>
          {pulling ? 'Pulling...' : 'Pull Image'}
        </Button>
        <Button onClick={spinUp} disabled={loading || pulling}>
          {loading ? 'Creating...' : `Start ${count} Containers`}
        </Button>
        <Button onClick={refresh} variant="secondary" disabled={loading || pulling}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {containers.map(c => (
            <tr key={c.Id}>
              <td>{c.Names.join(',')}</td>
              <td>{c.State}</td>
              <td className="flex items-center gap-2">
                {c.State !== 'running' && (
                  <Button
                    size="sm"
                    onClick={() => startContainer(c.Id)}
                    disabled={loading || busyContainer === c.Id}
                  >
                    {busyContainer === c.Id ? 'Starting...' : 'Start'}
                  </Button>
                )}
                {c.State === 'running' && (
                  <Button
                    size="sm"
                    onClick={() => stopContainer(c.Id)}
                    disabled={loading || busyContainer === c.Id}
                  >
                    {busyContainer === c.Id ? 'Stopping...' : 'Stop'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteContainer(c.Id)}
                  disabled={loading || busyContainer === c.Id}
                >
                  {busyContainer === c.Id ? 'Deleting...' : 'Delete'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
