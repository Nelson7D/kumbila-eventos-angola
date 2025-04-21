
import React, { useState, useEffect } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, Clock, MapPin, Star, Home, FileText, User, 
  LogOut, Settings, MessageCircle, RotateCcw, Users,
  ChevronDown, DollarSign, CirclePlus, Check, X, BarChart3, 
  PieChart, Download, Filter, CreditCard, Info, Bell
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { reservationService } from '@/services/reservationService';
import { toast } from '@/hooks/use-toast';
import { ReservationDetailModal } from '@/components/ReservationDetailModal';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarSeparator
} from '@/components/ui/sidebar';

const OwnerDashboard = () => {
  const [isPremium] = useState(false); // Mock data - in real app, this would come from user profile
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('year');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch owner spaces
        const spacesData = await reservationService.getOwnerSpaces();
        setSpaces(spacesData);
        
        // Fetch reservations
        const reservationsData = await reservationService.getOwnerReservations();
        setReservations(reservationsData);
        
        // Fetch stats
        const statsData = await reservationService.getOwnerReservationStats(timeframe);
        setStats(statsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching owner data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeframe]);
  
  const handleConfirmReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      await reservationService.updateReservationStatus(selectedReservation.id, 'confirmada');
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === selectedReservation.id 
            ? { ...res, status: 'confirmada' } 
            : res
        )
      );
      setDetailModalOpen(false);
      toast({
        title: "Reserva confirmada",
        description: "A reserva foi confirmada com sucesso.",
      });
    } catch (error) {
      console.error("Error confirming reservation:", error);
    }
  };
  
  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      await reservationService.updateReservationStatus(selectedReservation.id, 'cancelada');
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === selectedReservation.id 
            ? { ...res, status: 'cancelada' } 
            : res
        )
      );
      setDetailModalOpen(false);
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso.",
      });
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };
  
  const handleCheckin = async () => {
    if (!selectedReservation) return;
    
    try {
      const success = await reservationService.performManualCheckin(selectedReservation.id);
      if (success) {
        setReservations(prevReservations => 
          prevReservations.map(res => 
            res.id === selectedReservation.id 
              ? { ...res, status: 'em_andamento' } 
              : res
          )
        );
        setDetailModalOpen(false);
      }
    } catch (error) {
      console.error("Error performing check-in:", error);
    }
  };
  
  const handleCheckout = async () => {
    if (!selectedReservation) return;
    
    try {
      const success = await reservationService.performManualCheckout(selectedReservation.id);
      if (success) {
        setReservations(prevReservations => 
          prevReservations.map(res => 
            res.id === selectedReservation.id 
              ? { ...res, status: 'finalizada' } 
              : res
          )
        );
        setDetailModalOpen(false);
      }
    } catch (error) {
      console.error("Error performing check-out:", error);
    }
  };
  
  const handleViewReservationDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setDetailModalOpen(true);
  };
  
  const isPastEvent = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isAfter(new Date(), date);
    } catch {
      return false;
    }
  };
  
  // Format AOA currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), "HH:mm", { locale: ptBR });
    } catch {
      return "Horário não disponível";
    }
  };
  
  // Calculate average rating for a space
  const calculateAverageRating = (space: any) => {
    if (!space.reviews || space.reviews.length === 0) return 0;
    return space.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / space.reviews.length;
  };
  
  // Render reservation status
  const renderReservationStatus = (status: string) => {
    switch(status) {
      case "pendente":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pendente</Badge>;
      case "confirmada":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmada</Badge>;
      case "em_andamento":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Em andamento</Badge>;
      case "finalizada":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Finalizada</Badge>;
      case "cancelada":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Navbar />
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
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
                      <BarChart3 />
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
                    <SidebarMenuButton
                      tooltip="Mensagens"
                    >
                      <MessageCircle />
                      <span>Mensagens</span>
                      <Badge className="ml-auto bg-red-500 text-white hover:bg-red-600">2</Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Perfil"
                    >
                      <User />
                      <span>Perfil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Configurações"
                    >
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
          
          <SidebarInset>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Painel do Proprietário</h1>
                  <p className="text-muted-foreground">Gerencie seus espaços e reservas</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="sm:hidden" />
                  
                  <Button variant="outline" size="sm">
                    <Bell size={18} className="mr-2" />
                    Notificações
                  </Button>
                  
                  {isPremium && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap md:hidden mb-4 -mx-2">
                <div className="w-1/2 px-2 mb-4">
                  <Button 
                    variant={activeTab === "dashboard" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <FileText size={18} className="mr-2" />
                    Dashboard
                  </Button>
                </div>
                <div className="w-1/2 px-2 mb-4">
                  <Button 
                    variant={activeTab === "spaces" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("spaces")}
                  >
                    <Home size={18} className="mr-2" />
                    Espaços
                  </Button>
                </div>
                <div className="w-1/2 px-2">
                  <Button 
                    variant={activeTab === "reservations" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("reservations")}
                  >
                    <Calendar size={18} className="mr-2" />
                    Reservas
                  </Button>
                </div>
                <div className="w-1/2 px-2">
                  <Button 
                    variant={activeTab === "reports" ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("reports")}
                  >
                    <BarChart3 size={18} className="mr-2" />
                    Relatórios
                  </Button>
                </div>
              </div>
              
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Espaços Cadastrados</p>
                            <h3 className="text-2xl font-bold mt-1">{spaces.length}</h3>
                          </div>
                          <div className="bg-primary/10 p-2 rounded-md">
                            <Home className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Reservas Totais</p>
                            <h3 className="text-2xl font-bold mt-1">{reservations.length}</h3>
                          </div>
                          <div className="bg-blue-50 p-2 rounded-md">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
                            <div className="flex items-center mt-1">
                              <h3 className="text-2xl font-bold">{stats?.averageRating.toFixed(1) || "0.0"}</h3>
                              <span className="text-xs text-gray-500 ml-1">/5</span>
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded-md">
                            <Star className="h-5 w-5 text-yellow-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Receita Total</p>
                            <h3 className="text-xl font-bold mt-1">{formatCurrency(stats?.revenue || 0)}</h3>
                          </div>
                          <div className="bg-green-50 p-2 rounded-md">
                            <DollarSign className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Reservas Recentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {loading ? (
                            <p className="text-center py-4 text-gray-500">Carregando...</p>
                          ) : reservations.length > 0 ? (
                            reservations.slice(0, 3).map(reservation => (
                              <div key={reservation.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                                {reservation.user?.avatar_url ? (
                                  <img 
                                    src={reservation.user?.avatar_url} 
                                    alt={reservation.user?.full_name || "Cliente"}
                                    className="w-10 h-10 rounded-full mr-3 object-cover" 
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                                    <User size={20} className="text-gray-500" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                    <h3 className="font-medium">{reservation.user?.full_name || "Cliente"}</h3>
                                    {renderReservationStatus(reservation.status)}
                                  </div>
                                  <p className="text-gray-500 text-sm">{reservation.space?.name}</p>
                                  <div className="flex flex-wrap mt-2 text-sm text-gray-600">
                                    <div className="flex items-center mr-4">
                                      <Calendar size={14} className="mr-1 text-gray-400" />
                                      <span>{formatDate(reservation.start_datetime)}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock size={14} className="mr-1 text-gray-400" />
                                      <span>{formatTime(reservation.start_datetime)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="hidden sm:flex flex-col items-end">
                                  <span className="font-medium">{formatCurrency(reservation.total_price)}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto mt-1"
                                    onClick={() => handleViewReservationDetails(reservation)}
                                  >
                                    Ver detalhes
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-500">Nenhuma reserva recente.</p>
                            </div>
                          )}
                          
                          {reservations.length > 3 && (
                            <Button 
                              variant="outline" 
                              className="w-full mt-2" 
                              onClick={() => setActiveTab("reservations")}
                            >
                              Ver todas as reservas
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Meus Espaços</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {loading ? (
                            <p className="text-center py-4 text-gray-500">Carregando...</p>
                          ) : spaces.length > 0 ? (
                            spaces.map(space => (
                              <div key={space.id} className="flex items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 flex items-center justify-center">
                                  <Home size={24} className="text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm">{space.name}</h3>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPin size={12} className="mr-1" />
                                    <span>{space.location || "Sem localização"}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-500">Nenhum espaço cadastrado.</p>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <a 
                              href="/espacos/criar"
                              className="text-primary hover:underline text-sm flex items-center"
                            >
                              <CirclePlus size={16} className="mr-1" />
                              Adicionar novo espaço
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Reservas por Mês</CardTitle>
                        <select 
                          className="text-sm border rounded-md p-1"
                          value={timeframe}
                          onChange={(e) => setTimeframe(e.target.value)}
                        >
                          <option value="year">Últimos 12 meses</option>
                          <option value="month">Este Mês</option>
                        </select>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          {loading ? (
                            <p className="text-center py-12 text-gray-500">Carregando...</p>
                          ) : (
                            <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                              {stats?.monthlyData.map((data: any, i: number) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div 
                                    className="bg-blue-500 w-8 rounded-t" 
                                    style={{height: `${data.bookings * 20}px`}}
                                  ></div>
                                  <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Ganhos por Mês</CardTitle>
                        <select 
                          className="text-sm border rounded-md p-1"
                          value={timeframe}
                          onChange={(e) => setTimeframe(e.target.value)}
                        >
                          <option value="year">Últimos 12 meses</option>
                          <option value="month">Este Mês</option>
                        </select>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          {loading ? (
                            <p className="text-center py-12 text-gray-500">Carregando...</p>
                          ) : (
                            <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                              {stats?.monthlyData.map((data: any, i: number) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div 
                                    className="bg-green-500 w-8 rounded-t" 
                                    style={{height: `${data.revenue > 0 ? Math.max((data.revenue / 5000), 5) : 0}px`}}
                                  ></div>
                                  <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Spaces Tab */}
              {activeTab === "spaces" && (
                <div>
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Meus Espaços</h2>
                    <Button className="gap-1">
                      <CirclePlus size={18} />
                      Adicionar Espaço
                    </Button>
                  </div>
                  
                  {loading ? (
                    <Card className="p-12">
                      <div className="flex justify-center">
                        <p className="text-gray-500">Carregando espaços...</p>
                      </div>
                    </Card>
                  ) : spaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {spaces.map(space => (
                        <Card key={space.id} className="overflow-hidden">
                          <div className="h-32 bg-gray-100 flex items-center justify-center">
                            <Home size={48} className="text-gray-400" />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{space.name}</h3>
                              <div className="flex items-center">
                                <Star className="text-yellow-500 h-4 w-4 mr-1" />
                                <span className="text-sm">{calculateAverageRating(space).toFixed(1)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{space.location || "Sem localização"}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>Capacidade: {space.capacity || "N/A"}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <DollarSign size={14} />
                                <span>{formatCurrency(space.price_per_day || 0)}/dia</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div>
                                <span className="text-xs text-gray-500">Reservas:</span>
                                <span className="ml-1 font-medium">{space.reservations?.length || 0}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Editar</Button>
                                <Button variant="default" size="sm">Ver Reservas</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12">
                      <div className="text-center space-y-4">
                        <Home size={48} className="mx-auto text-gray-300" />
                        <h3 className="text-lg font-medium">Você ainda não tem nenhum espaço cadastrado</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Adicione seu primeiro espaço para começar a receber reservas
                          e gerenciar seu negócio através do painel.
                        </p>
                        <Button className="gap-1 mt-2">
                          <CirclePlus size={18} />
                          Adicionar Meu Primeiro Espaço
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Reservations Tab */}
              {activeTab === "reservations" && (
                <div>
                  <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-semibold">Reservas Recebidas</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        Filtrar
                      </Button>
                    </div>
                  </div>
                  
                  {loading ? (
                    <Card className="p-12">
                      <div className="flex justify-center">
                        <p className="text-gray-500">Carregando reservas...</p>
                      </div>
                    </Card>
                  ) : reservations.length > 0 ? (
                    <Card>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Espaço</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Horário</TableHead>
                              <TableHead>Valor</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reservations.map(reservation => (
                              <TableRow key={reservation.id}>
                                <TableCell className="font-medium">
                                  {reservation.user?.full_name || "Cliente"}
                                </TableCell>
                                <TableCell>{reservation.space?.name || "Espaço"}</TableCell>
                                <TableCell>{formatDate(reservation.start_datetime)}</TableCell>
                                <TableCell>{formatTime(reservation.start_datetime)}</TableCell>
                                <TableCell>{formatCurrency(reservation.total_price)}</TableCell>
                                <TableCell>{renderReservationStatus(reservation.status)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleViewReservationDetails(reservation)}
                                    >
                                      <Info size={16} />
                                      <span className="sr-only">Ver detalhes</span>
                                    </Button>
                                    
                                    {reservation.status === "pendente" && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={async () => {
                                          await reservationService.updateReservationStatus(reservation.id, 'confirmada');
                                          setReservations(prev => 
                                            prev.map(r => r.id === reservation.id ? {...r, status: 'confirmada'} : r)
                                          );
                                        }}
                                      >
                                        <Check size={16} />
                                        <span className="sr-only">Confirmar</span>
                                      </Button>
                                    )}
                                    
                                    {['pendente', 'confirmada'].includes(reservation.status) && !isPastEvent(reservation.start_datetime) && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={async () => {
                                          await reservationService.updateReservationStatus(reservation.id, 'cancelada');
                                          setReservations(prev => 
                                            prev.map(r => r.id === reservation.id ? {...r, status: 'cancelada'} : r)
                                          );
                                        }}
                                      >
                                        <X size={16} />
                                        <span className="sr-only">Cancelar</span>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-12">
                      <div className="text-center space-y-4">
                        <Calendar size={48} className="mx-auto text-gray-300" />
                        <h3 className="text-lg font-medium">Nenhuma reserva encontrada</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Você ainda não possui reservas recebidas para seus espaços.
                          Elas aparecerão aqui quando clientes fizerem reservas.
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div>
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Relatórios</h2>
                    <div className="flex gap-2">
                      <select 
                        className="text-sm border rounded-md p-1"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                      >
                        <option value="year">Últimos 12 meses</option>
                        <option value="month">Este Mês</option>
                        <option value="week">Esta Semana</option>
                      </select>
                      
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download size={16} />
                        Exportar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500">Total de Reservas</p>
                          <h3 className="text-2xl font-bold mt-1">{stats?.totalReservations || 0}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {stats?.confirmedReservations || 0} confirmadas • {stats?.cancelledReservations || 0} canceladas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500">Faturamento Total</p>
                          <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats?.revenue || 0)}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Taxa de conclusão: {stats?.completionRate?.toFixed(0) || 0}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500">Avaliação Média</p>
                          <div className="flex items-center mt-1">
                            <h3 className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}</h3>
                            <span className="text-xs text-gray-500 ml-1">/5</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={14} 
                                className={star <= Math.round(stats?.averageRating || 0) 
                                  ? "text-yellow-500 fill-yellow-500" 
                                  : "text-gray-300"} 
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Reservas por Mês</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        {loading ? (
                          <p className="text-center py-12 text-gray-500">Carregando...</p>
                        ) : (
                          <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                            {stats?.monthlyData.map((data: any, i: number) => (
                              <div key={i} className="flex flex-col items-center">
                                <div 
                                  className="bg-blue-500 w-10 rounded-t" 
                                  style={{height: `${data.bookings * 30}px`}}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Receita por Mês</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        {loading ? (
                          <p className="text-center py-12 text-gray-500">Carregando...</p>
                        ) : (
                          <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                            {stats?.monthlyData.map((data: any, i: number) => (
                              <div key={i} className="flex flex-col items-center">
                                <div 
                                  className="bg-green-500 w-10 rounded-t" 
                                  style={{height: `${data.revenue > 0 ? Math.max((data.revenue / 5000), 5) : 0}px`}}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                                <span className="text-xs text-gray-500">{formatCurrency(data.revenue).replace('AOA', '').trim()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {isPremium ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Análise Avançada (Premium)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-4">Distribuição de Reservas por Espaço</h3>
                            <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center">
                              <PieChart size={120} className="text-gray-300" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium mb-4">Taxa de Conversão</h3>
                            <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center">
                              <BarChart3 size={120} className="text-gray-300" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button variant="outline">
                            <Download size={16} className="mr-2" />
                            Exportar Relatório Completo em PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-purple-900">Acesse Análises Avançadas</h3>
                            <p className="text-purple-700 mt-2">
                              Atualize para o plano Premium e tenha acesso a relatórios detalhados,
                              gráficos avançados e exporte seus dados em PDF ou Excel.
                            </p>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-center gap-2">
                                <Check size={18} className="text-green-600" />
                                <span>Análise de performance por espaço</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check size={18} className="text-green-600" />
                                <span>Tendências de reserva por dia da semana</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check size={18} className="text-green-600" />
                                <span>Exportação de relatórios em PDF/Excel</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                              Atualizar para Premium
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
            
            <footer className="mt-12 p-6 border-t">
              <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Kumbila - Painel do Proprietário
              </div>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
      
      <Footer />
      
      {selectedReservation && (
        <ReservationDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          reservation={selectedReservation}
          onConfirm={handleConfirmReservation}
          onCancel={handleCancelReservation}
          onCheckin={handleCheckin}
          onCheckout={handleCheckout}
          isPast={isPastEvent(selectedReservation.start_datetime)}
          isOwner={true}
        />
      )}
    </>
  );
};

export default OwnerDashboard;
