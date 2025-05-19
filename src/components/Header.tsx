// src/components/Header.tsx
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from '@/context/NotificationsContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const Header = ({ sidebarCollapsed, setSidebarCollapsed }: HeaderProps) => {
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const { notifications, clearNotifications } = useNotifications(); // <—

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-honeygain-card border-b border-[#2d3749]">
      <div className="flex items-center">
        <SidebarTrigger onClick={toggleSidebar} className="text-honeygain-text" />
        <h1 className="ml-4 text-xl font-bold">Honeygain Legit Farm</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Dropdown de notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-honeygain-text relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-honeygain-card border-[#2d3749] text-honeygain-text" forceMount>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2d3749]" />
            
            {notifications.length > 0 ? (
              notifications.map(n => (
                <DropdownMenuItem key={n.id} className="flex flex-col text-sm">
                  <span className="font-medium">{n.title}</span>
                  <span className="truncate">{n.message}</span>
                  <span className="text-xs text-honeygain-muted">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="text-sm text-honeygain-muted">
                No notifications
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="bg-[#2d3749]" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-[#2d3749] text-center text-xs text-red-400"
              onSelect={() => clearNotifications()}
            >
              Clear All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar / conta */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-[#2d3749]">
                <AvatarFallback className="bg-honeygain-card text-honeygain-text">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-honeygain-card border-[#2d3749] text-honeygain-text" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2d3749]" />
            <DropdownMenuItem className="cursor-pointer hover:bg-[#2d3749]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#2d3749]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2d3749]" />
            <DropdownMenuItem className="cursor-pointer hover:bg-[#2d3749] text-red-400">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
