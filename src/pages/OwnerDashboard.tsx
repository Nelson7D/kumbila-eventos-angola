import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, Clock, MapPin, Star, Home, FileText, User, 
  LogOut, Heart, Settings, MessageCircle, RotateCcw, Users,
  ChevronDown, DollarSign, CirclePlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OwnerDashboard = () => {
  // Mock data for owner
  const owner = {
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "+244 923 456 789",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    spaces: 3,
    bookings: 12,
    rating: 4.8,
    earnings: 850000
  };
  
  // Mock spaces
  const spaces = [
    {
      id: "1",
      name: "Salão de Festas Miramar",
      image: "/placeholder.svg",
      location: "Miramar, Luanda",
      price: 250000,
      capacity: 150,
      type: "Salão de festas",
      bookings: 8,
      rating: 4.9
    },
    {
      id: "2",
      name: "Jardim Talatona",
      image: "/placeholder.svg",
      location: "Talatona, Luanda",
      price: 180000,
      capacity: 100,
      type: "Espaço ao ar livre",
      bookings: 3,
      rating: 4.7
    },
    {
      id: "3",
      name: "Sala de Conferências Central",
      image: "/placeholder.svg",
      location: "Centro, Luanda",
      price: 150000,
      capacity: 80,
      type: "Sala de conferência",
      bookings: 1,
      rating: 0
    }
  ];
  
  // Mock upcoming bookings
  const bookings = [
    {
      id: "1",
      spaceName: "Salão de Festas Miramar",
      spaceImage: "/placeholder.svg",
      clientName: "Carlos Mendes",
      clientAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "2025-04-20",
      time: "18:00 - 23:00",
      price: 250000,
      status: "confirmado",
      phoneNumber: "+244 923 123 456"
    },
    {
      id: "2",
      spaceName: "Jardim Talatona",
      spaceImage: "/placeholder.svg",
      clientName: "Ana Santos",
      clientAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      date: "2025-05-15",
      time: "15:00 - 20:00",
      price: 180000,
      status: "pendente",
      phoneNumber: "+244 923 987 654"
    },
    {
      id: "3",
      spaceName: "Sala de Conferências Central",
      spaceImage: "/placeholder.svg",
      clientName: "Pedro Oliveira",
      clientAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      date: "2025-04-05",
      time: "09:00 - 17:00",
      price: 150000,
      status: "cancelado",
      phoneNumber: "+244 923 555 777"
    }
  ];
  
  // Format AOA currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
  };
  
  // Render booking status
  const renderBookingStatus = (status: string) => {
    switch(status) {
      case "confirmado":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmado</span>;
      case "pendente":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pendente</span>;
      case "cancelado":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Cancelado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };
  
  // Get chart data for bookings by month
  const getBookingsByMonth = () => {
    // This would typically come from an API with actual data
    return [
      { month: 'Jan', bookings: 2 },
      { month: 'Fev', bookings: 1 },
      { month: 'Mar', bookings: 3 },
      { month: 'Abr', bookings: 2 },
      { month: 'Mai', bookings: 1 },
      { month: 'Jun', bookings: 0 },
      { month: 'Jul', bookings: 0 },
      { month: 'Ago', bookings: 0 },
      { month: 'Set', bookings: 0 },
      { month: 'Out', bookings: 0 },
      { month: 'Nov', bookings: 0 },
      { month: 'Dez', bookings: 3 },
    ];
  };
  
  // Get earnings data
  const getEarningsByMonth = () => {
    // This would typically come from an API with actual data
    return [
      { month: 'Jan', earnings: 250000 },
      { month: 'Fev', earnings: 180000 },
      { month: 'Mar', earnings: 400000 },
      { month: 'Abr', earnings: 320000 },
      { month: 'Mai', earnings: 180000 },
      { month: 'Jun', earnings: 0 },
      { month: 'Jul', earnings: 0 },
      { month: 'Ago', earnings: 0 },
      { month: 'Set', earnings: 0 },
      { month: 'Out', earnings: 0 },
      { month: 'Nov', earnings: 0 },
      { month: 'Dez', earnings: 450000 },
    ];
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={owner.avatar} 
                  alt={owner.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover" 
                />
                <h2 className="text-xl font-semibold">{owner.name}</h2>
                <p className="text-gray-500 text-sm">{owner.email}</p>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center p-2 rounded-lg bg-primary text-white">
                  <FileText size={18} className="mr-3" />
                  Dashboard
                </button>
                <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Home size={18} className="mr-3" />
                  Meus Espaços
                </button>
                <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Calendar size={18} className="mr-3" />
                  Reservas
                </button>
                <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <MessageCircle size={18} className="mr-3" />
                  Mensagens
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                </button>
                <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <User size={18} className="mr-3" />
                  Perfil
                </button>
                <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Settings size={18} className="mr-3" />
                  Configurações
                </button>
                <hr className="my-3" />
                <button className="w-full flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50">
                  <LogOut size={18} className="mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <h1 className="text-2xl font-semibold mb-6">Dashboard do Proprietário</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Espaços Cadastrados</p>
                      <h3 className="text-2xl font-bold mt-1">{owner.spaces}</h3>
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
                      <h3 className="text-2xl font-bold mt-1">{owner.bookings}</h3>
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
                        <h3 className="text-2xl font-bold">{owner.rating}</h3>
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
                      <p className="text-sm font-medium text-gray-500">Ganho Total</p>
                      <h3 className="text-xl font-bold mt-1">{formatCurrency(owner.earnings)}</h3>
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
                <CardHeader>
                  <CardTitle>Reservas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {bookings.length > 0 ? (
                      bookings.map(booking => (
                        <div key={booking.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                          <img 
                            src={booking.clientAvatar} 
                            alt={booking.clientName}
                            className="w-10 h-10 rounded-full mr-3" 
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                              <h3 className="font-medium">{booking.clientName}</h3>
                              {renderBookingStatus(booking.status)}
                            </div>
                            <p className="text-gray-500 text-sm">{booking.spaceName}</p>
                            <div className="flex flex-wrap mt-2 text-sm text-gray-600">
                              <div className="flex items-center mr-4">
                                <Calendar size={14} className="mr-1 text-gray-400" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="font-medium">{formatCurrency(booking.price)}</span>
                            <a 
                              href={`https://wa.me/${booking.phoneNumber.replace(/\s+/g, '')}`}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline text-sm mt-1"
                            >
                              Contatar
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">Nenhuma reserva recente.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meus Espaços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spaces.map(space => (
                      <div key={space.id} className="flex items-center">
                        <img 
                          src={space.image}
                          alt={space.name}
                          className="w-12 h-12 object-cover rounded-md mr-3" 
                        />
                        <div>
                          <h3 className="font-medium text-sm">{space.name}</h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin size={12} className="mr-1" />
                            <span>{space.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
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
                  <select className="text-sm border rounded-md p-1">
                    <option>Últimos 12 meses</option>
                    <option>Este Ano</option>
                  </select>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    {/* Simplified chart representation - would use recharts in a real app */}
                    <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                      {getBookingsByMonth().map((data, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="bg-blue-500 w-8 rounded-t" 
                            style={{height: `${data.bookings * 20}px`}}
                          ></div>
                          <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Ganhos por Mês</CardTitle>
                  <select className="text-sm border rounded-md p-1">
                    <option>Últimos 12 meses</option>
                    <option>Este Ano</option>
                  </select>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    {/* Simplified chart representation - would use recharts in a real app */}
                    <div className="flex items-end justify-between h-full gap-1 pt-10 pb-4 border-b">
                      {getEarningsByMonth().map((data, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="bg-green-500 w-8 rounded-t" 
                            style={{height: `${data.earnings > 0 ? Math.max((data.earnings / 5000), 5) : 0}px`}}
                          ></div>
                          <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OwnerDashboard;
