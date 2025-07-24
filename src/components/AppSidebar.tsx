import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Heart, 
  Bot, 
  Building, 
  Plane, 
  Briefcase, 
  Crown
} from 'lucide-react';

const navigationItems = [
  { title: "Discover", url: "/travel-buddies", icon: Heart },
  { title: "GAFFL AI", url: "/ai-travel", icon: Bot },
  { title: "Stays", url: "/hotels", icon: Building },
  { title: "Flights", url: "/flights", icon: Plane },
  { title: "My Trips", url: "/my-trips", icon: Briefcase },
  { title: "Get Unlimited", url: "/premium", icon: Crown },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-red-50 text-red-600 font-medium border-r-2 border-red-600" : "text-gray-700 hover:bg-gray-50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-gray-900">Utrippin</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-lg mx-3 transition-colors
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}