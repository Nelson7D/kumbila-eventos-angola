
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Home, 
  Calendar, 
  BarChart, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut, 
  Star 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  activeTab: string;
  setActiveTab: (v: string) => void;
  isPremium: boolean;
};

export default function OwnerSidebar({ activeTab, setActiveTab, isPremium }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center text-center mb-6">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="User Avatar"
            className="w-16 h-16 rounded-full mb-4 object-cover" 
          />
          <h2 className="text-lg font-semibold">Maria Silva</h2>
          <p className="text-xs text-muted-foreground">Proprietária</p>
          {isPremium && (
            <Badge variant="secondary" className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
              Premium
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "dashboard"}
                tooltip="Dashboard"
                onClick={() => setActiveTab("dashboard")}
              >
                <FileText />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "spaces"}
                tooltip="Meus Espaços"
                onClick={() => setActiveTab("spaces")}
              >
                <Home />
                <span>Meus Espaços</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "reservations"}
                tooltip="Reservas"
                onClick={() => setActiveTab("reservations")}
              >
                <Calendar />
                <span>Reservas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === "reports"}
                tooltip="Relatórios"
                onClick={() => setActiveTab("reports")}
              >
                <BarChart />
                <span>Relatórios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Mensagens">
                <MessageCircle />
                <span>Mensagens</span>
                <Badge className="ml-auto bg-red-500 text-white hover:bg-red-600">2</Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Perfil">
                <User />
                <span>Perfil</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configurações">
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isPremium && (
          <div className="px-4 py-3 mx-2 mb-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
            <h4 className="font-medium text-sm">Atualize para Premium</h4>
            <p className="text-xs mt-1 mb-2">Acesse relatórios avançados e mais recursos.</p>
            <Button size="sm" variant="secondary" className="w-full text-xs">
              Saiba Mais
            </Button>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2" size={18} />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
