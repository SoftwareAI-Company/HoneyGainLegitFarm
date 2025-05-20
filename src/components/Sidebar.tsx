// Sidebar.tsx
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Zap,
  Settings,
  BarChart,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import HoneygainLogo from "./HoneygainLogo";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const toggle = () => setCollapsed(!collapsed);

  return (
  <ShadcnSidebar
      collapsible="icon"
      className="transition-[width] duration-300 ease-in-out bg-honeygain-card border-r border-[#2d3749] flex flex-col overflow-hidden shrink-0"
    >
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <HoneygainLogo className="w-8 h-8" />
          <span
            className={cn(
              "ml-2 text-xl font-bold text-honeygain-text transition-opacity duration-300",
              collapsed ? "opacity-0" : "opacity-100"
            )}
          >
          </span>
        </div>

      </div>
      <SidebarContent>
        <SidebarMenu>
          {[
            { to: "/dashboard",        icon: <LayoutDashboard />, label: "Dashboard" },
            { to: "/automations", icon: <Zap />,          label: "Automations" },
            { to: "/metrics",  icon: <BarChart />,        label: "Metrics" },
            { to: "/settings", icon: <Settings />,        label: "Settings" },
          ].map(({ to, icon, label }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={to}
                  className="flex items-center py-3 px-4 rounded-md transition-colors text-honeygain hover:bg-[#2d3749] hover:text-honeygain-text data-[active]:bg-[#2d3749] data-[active]:text-honeygain-text"
                >
                  {icon}
                  <span className="nav-label transition-[max-width,opacity,margin] duration-300 whitespace-nowrap">
                    {label}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          cn(
            "flex items-center py-3 px-4 rounded-md transition-colors text-honeygain",
            isActive
              ? "bg-[#2d3749] text-honeygain-text"
              : "hover:bg-[#2d3749] hover:text-honeygain-text"
          )
        }
      >
        {icon}
        <span
          className={cn(
            "ml-3 whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300",
            collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
          )}
        >
          {label}
        </span>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default Sidebar;
