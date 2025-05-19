// src\pages\Settings.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useHoneygain } from '@/hooks/useHoneygain';

const Settings = () => {
  const { toast } = useToast();
  const { login, isAuthenticated, logout, isAuthenticating } = useHoneygain();
  const [activeTab, setActiveTab] = useState<string>('accounts');

  // Honeygain credentials
  const [honeygainEmail, setHoneygainEmail] = useState('');
  const [honeygainPassword, setHoneygainPassword] = useState('');
  
  // Steam settings
  const [steamUsername, setSteamUsername] = useState('');
  const [steamPassword, setSteamPassword] = useState('');
  const [steamAppId, setSteamAppId] = useState('220240');
  const [steamInstallDir, setSteamInstallDir] = useState('C:\\SteamApps\\220240');
  const [steamCmdPath, setSteamCmdPath] = useState('C:\\Users\\ualer\\Downloads\\HoneyFarm\\SteamCMD\\steamcmd.exe');
  
  // YouTube settings
  const [ytVideoFile, setYtVideoFile] = useState('yts.txt');
  const [ytOutput, setYtOutput] = useState('yt_downloads');
  const [interval, setInterval] = useState('1');
  
  // App settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSteamUsername = localStorage.getItem('steam_username');
    const savedSteamAppId = localStorage.getItem('steam_app_id');
    const savedSteamInstallDir = localStorage.getItem('steam_install_dir');
    const savedSteamCmdPath = localStorage.getItem('steam_cmd_path');
    const savedYtVideoFile = localStorage.getItem('yt_video_file');
    const savedYtOutput = localStorage.getItem('yt_output');
    const savedInterval = localStorage.getItem('interval');
    
    if (savedSteamUsername) setSteamUsername(savedSteamUsername);
    if (savedSteamAppId) setSteamAppId(savedSteamAppId);
    if (savedSteamInstallDir) setSteamInstallDir(savedSteamInstallDir);
    if (savedSteamCmdPath) setSteamCmdPath(savedSteamCmdPath);
    if (savedYtVideoFile) setYtVideoFile(savedYtVideoFile);
    if (savedYtOutput) setYtOutput(savedYtOutput);
    if (savedInterval) setInterval(savedInterval);
  }, []);
  
  const inDevToast = () => toast({ title: 'In Development', description: 'This feature is in development.', variant: 'default' });

  const handleSaveHoneygain = async () => {
    if (honeygainEmail && honeygainPassword) {
      await login(honeygainEmail, honeygainPassword);
    } else {
      toast({
        title: "Validation Error",
        description: "Email and password are required.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveSteamCredentials = () => {
    // Save Steam settings to localStorage
    if (steamUsername) localStorage.setItem('steam_username', steamUsername);
    if (steamAppId) localStorage.setItem('steam_app_id', steamAppId);
    if (steamInstallDir) localStorage.setItem('steam_install_dir', steamInstallDir);
    if (steamCmdPath) localStorage.setItem('steam_cmd_path', steamCmdPath);
    
    toast({
      title: "Steam Settings Saved",
      description: "Your Steam configuration has been saved.",
    });
  };
  
  const handleSaveYoutubeSettings = () => {
    // Save YouTube settings to localStorage
    localStorage.setItem('yt_video_file', ytVideoFile);
    localStorage.setItem('yt_output', ytOutput);
    localStorage.setItem('interval', interval);
    
    toast({
      title: "YouTube Settings Saved",
      description: "Your YouTube configuration has been saved.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: `Notifications have been ${notificationsEnabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Saved",
      description: `Dark mode has been ${darkMode ? 'enabled' : 'disabled'}.`,
    });
  };

  // E no botão “Save Advanced Settings” basta ler autoStart (já persiste via hook):
  const handleSaveAdvanced = () => {
    toast({
      title: "Advanced Settings Saved",
      description: `Auto-start Automation has been ${autoStart ? 'enabled' : 'disabled'}.`,
    });
  };

  // Handler that prevents switching to in-dev tabs
  const handleTabChange = (value: string) => {
    const disabled = ['steam', 'youtube', 'appearance', 'advanced'];
    if (disabled.includes(value)) {
      inDevToast();
    } else {
      setActiveTab(value);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>


      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-honeygain-card mb-6">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>

          <TabsTrigger value="steam">Steam</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>


        <TabsContent value="accounts" className="space-y-6">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Honeygain Account</CardTitle>
              <CardDescription className="text-honeygain-muted">
                {isAuthenticated 
                  ? "Your Honeygain account is connected." 
                  : "Enter your Honeygain credentials to enable automations."}
              </CardDescription>
            </CardHeader>
            {!isAuthenticated ? (
              <>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="honeygain-email">Email</Label>
                    <Input 
                      id="honeygain-email"
                      value={honeygainEmail}
                      onChange={(e) => setHoneygainEmail(e.target.value)}
                      className="bg-honeygain-background border-[#2d3749]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="honeygain-password">Password</Label>
                    <Input 
                      id="honeygain-password"
                      type="password"
                      value={honeygainPassword}
                      onChange={(e) => setHoneygainPassword(e.target.value)}
                      className="bg-honeygain-background border-[#2d3749]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-honeygain hover:bg-honeygain-dark text-black"
                    onClick={handleSaveHoneygain}
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? "Connecting..." : "Connect Honeygain"}
                  </Button>
                </CardFooter>
              </>
            ) : (
              <CardFooter>
                <Button 
                  variant="destructive"
                  onClick={logout}
                >
                  Disconnect Honeygain
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Steam Account</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Enter your Steam credentials for download automation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="steam-username">Username</Label>
                <Input 
                  id="steam-username"
                  value={steamUsername}
                  onChange={(e) => setSteamUsername(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="steam-password">Password</Label>
                <Input 
                  id="steam-password"
                  type="password"
                  value={steamPassword}
                  onChange={(e) => setSteamPassword(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleSaveSteamCredentials}
              >
                Save Steam Credentials
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="steam" className="space-y-6">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Steam Configuration</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Configure the Steam automation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="steam-app-id">Steam App ID</Label>
                <Input 
                  id="steam-app-id"
                  value={steamAppId}
                  onChange={(e) => setSteamAppId(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="220240"
                />
                <p className="text-xs text-honeygain-muted">The ID of the Steam app to download</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="steam-install-dir">Install Directory</Label>
                <Input 
                  id="steam-install-dir"
                  value={steamInstallDir}
                  onChange={(e) => setSteamInstallDir(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="C:\SteamApps\220240"
                />
                <p className="text-xs text-honeygain-muted">Where the Steam app will be installed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="steam-cmd-path">SteamCMD Path</Label>
                <Input 
                  id="steam-cmd-path"
                  value={steamCmdPath}
                  onChange={(e) => setSteamCmdPath(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="C:\SteamCMD\steamcmd.exe"
                />
                <p className="text-xs text-honeygain-muted">Path to the SteamCMD executable</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleSaveSteamCredentials}
              >
                Save Steam Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="youtube" className="space-y-6">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>YouTube Download Settings</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Configure the YouTube video download settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yt-video-file">Video List File</Label>
                <Input 
                  id="yt-video-file"
                  value={ytVideoFile}
                  onChange={(e) => setYtVideoFile(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="yts.txt"
                />
                <p className="text-xs text-honeygain-muted">Text file containing YouTube video URLs (one per line)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yt-output">Output Directory</Label>
                <Input 
                  id="yt-output"
                  value={ytOutput}
                  onChange={(e) => setYtOutput(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="yt_downloads"
                />
                <p className="text-xs text-honeygain-muted">Directory where downloaded videos will be stored</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval">Interval (minutes)</Label>
                <Input 
                  id="interval"
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  className="bg-honeygain-background border-[#2d3749]"
                  placeholder="1"
                  min="1"
                />
                <p className="text-xs text-honeygain-muted">Time between download operations (in minutes)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleSaveYoutubeSettings}
              >
                Save YouTube Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Configure when and how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-honeygain-muted">
                    Receive notifications about account activity and automations.
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-honeygain"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleSaveNotifications}
              >
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Customize how the application looks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-honeygain-muted">
                    Use dark theme for the application.
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-honeygain"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-honeygain hover:bg-honeygain-dark text-black"
                onClick={handleSaveAppearance}
              >
                Save Appearance Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="bg-honeygain-card border-[#2d3749]">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription className="text-honeygain-muted">
                Configure advanced automation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start">Auto-start Automation</Label>
                  <p className="text-sm text-honeygain-muted">
                    Automatically start automations when the application launches.
                  </p>
                </div>
                <Switch 
                  id="auto-start" 
                  checked={autoStart}
                  onCheckedChange={setAutoStart}
                  className="data-[state=checked]:bg-honeygain"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAdvanced} className="bg-honeygain hover:bg-honeygain-dark text-black">
                Save Advanced Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
