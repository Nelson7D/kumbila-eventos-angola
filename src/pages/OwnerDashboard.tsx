
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Home, 
  Plus, 
  LogOut, 
  Settings,
  MessageCircle,
  Star,
  BarChart2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data
  const owner = {
    name: "Maria Silva",
    email: "maria.silva@example.com",
    phone: "+244 923 456 789",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  };

  const stats = {
    revenue: 625000,
    bookings: 12,
    pendingBookings: 3,
    rating: 4.8
  };

  const spaces = [
    {
      id: "101",
      title: "Salão de Festas Miramar",
      image: "/placeholder.svg",
      price: 250000,
      location: "Miramar, Luanda",
      type: "Salão de festas",
      capacity: 120,
      bookings: 8
    },
    {
      id: "102",
      title: "Espaço Jardim Talatona",
      image: "/placeholder.svg",
      price: 180000,
      location: "Talatona, Luanda",
      type: "Espaço ao ar livre",
      capacity: 80,
      bookings: 4
    },
    {
      id: "103",
      title: "Sala de Conferências Central",
      image: "/placeholder.svg",
      price: 150000,
      location: "Centro, Luanda",
      type: "Sala de conferência",
      capacity: 50,
      bookings: 0
    }
  ];

  const bookings = [
    {
      id: "1",
      spaceName: "Salão de Festas Miramar",
      spaceImage: "/placeholder.svg",
      client: {
        name: "Carlos Mendes",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      date: "2025-04-20",
      time: "18:00 - 23:00",
      price: 250000,
      status: "confirmado",
      extraServices: ["Mesas e cadeiras", "Sistema de som"]
    },
    {
      id: "2",
      spaceName: "Espaço Jardim Talatona",
      spaceImage: "/placeholder.svg",
      client: {
        name: "Ana Sousa",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      date: "2025-05-15",
      time: "15:00 - 20:00",
      price: 180000,
      status: "pendente",
      extraServices: ["Decoração"]
    },
    {
      id: "3",
      spaceName: "Salão de Festas Miramar",
      spaceImage: "/placeholder.svg",
      client: {
        name: "Pedro Alves",
        avatar: "https://randomuser.me/api/portraits/men/43.jpg"
      },
      date: "2025-03-10",
      time: "09:00 - 17:00",
      price: 195000,
      status: "cancelado",
      extraServices: ["Buffet", "Mesas e cadeiras"]
    }
  ];

  const messages = [
    {
      id: "1",
      from: "Carlos Mendes",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Bom dia! Gostaria de saber se é possível adicionar mais 20 cadeiras na minha reserva do dia 20 de Abril?",
      date: "2025-04-01T10:30:00",
      unread: true
    },
    {
      id: "2",
      from: "Ana Sousa",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      message: "Olá! Estou interessada em reservar o Espaço Jardim Talatona. Tem disponibilidade para o dia 15 de Maio?",
      date: "2025-03-29T14:15:00",
      unread: false
    }
  ];

  const renderBookingStatus = (status) => {
    switch(status) {
      case "confirmado":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center"><CheckCircle size={14} className="mr-1" /> Confirmado</span>;
      case "pendente":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center"><AlertCircle size={14} className="mr-1" /> Pendente</span>;
      case "cancelado":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center"><XCircle size={14} className="mr-1" /> Cancelado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
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
                  className="w-24 h-24 rounded-full mb-4" 
                />
                <h2 className="text-xl font-semibold">{owner.name}</h2>
                <p className="text-gray-500 text-sm">{owner.email}</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "dashboard" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <BarChart2 size={18} className="mr-3" />
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab("espacos")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "espacos" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <Home size={18} className="mr-3" />
                  Meus Espaços
                </button>
                <button 
                  onClick={() => setActiveTab("reservas")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "reservas" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <Calendar size={18} className="mr-3" />
                  Reservas
                  {bookings.filter(b => b.status === "pendente").length > 0 && (
                    <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {bookings.filter(b => b.status === "pendente").length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("mensagens")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "mensagens" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <MessageCircle size={18} className="mr-3" />
                  Mensagens
                  {messages.some(m => m.unread) && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {messages.filter(m => m.unread).length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("configuracoes")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "configuracoes" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
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
            <div className="bg-primary text-white rounded-lg p-6 text-center">
              <Plus size={24} className="mx-auto mb-2" />
              <h3 className="font-medium mb-2">Adicionar novo espaço</h3>
              <p className="text-sm text-white/80 mb-4">Cadastre um novo espaço para aluguer</p>
              <a 
                href="/espacos/cadastrar" 
                className="inline-block w-full py-2 px-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Cadastrar Espaço
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-white p-1 rounded-lg shadow-sm">
                <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
                <TabsTrigger value="espacos" className="flex-1">Espaços</TabsTrigger>
                <TabsTrigger value="reservas" className="flex-1">Reservas</TabsTrigger>
                <TabsTrigger value="mensagens" className="flex-1">Mensagens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <DollarSign className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Receita Total</p>
                        <h3 className="font-semibold text-xl">
                          {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(stats.revenue)}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Calendar className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reservas</p>
                        <h3 className="font-semibold text-xl">{stats.bookings}</h3>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-yellow-100 p-3 rounded-full mr-4">
                        <Clock className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pendentes</p>
                        <h3 className="font-semibold text-xl">{stats.pendingBookings}</h3>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Star className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avaliação</p>
                        <h3 className="font-semibold text-xl">{stats.rating}/5</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Reservas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="flex items-center">
                            <img 
                              src={booking.client.avatar} 
                              alt={booking.client.name} 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{booking.client.name}</h4>
                              <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(booking.price)}</div>
                              {renderBookingStatus(booking.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <button 
                          onClick={() => setActiveTab("reservas")} 
                          className="text-primary hover:underline text-sm"
                        >
                          Ver todas as reservas
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Space Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho dos Espaços</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {spaces.map(space => (
                          <div key={space.id} className="flex items-center">
                            <img 
                              src={space.image} 
                              alt={space.title} 
                              className="w-14 h-14 object-cover rounded-lg mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{space.title}</h4>
                              <p className="text-sm text-gray-500">{space.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{space.bookings} reservas</div>
                              <div className="text-sm text-gray-500">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(space.price * space.bookings)} total</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="espacos">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">Meus Espaços</h1>
                  <a 
                    href="/espacos/cadastrar"
                    className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg px-4 py-2 flex items-center"
                  >
                    <Plus size={18} className="mr-1" />
                    Novo Espaço
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {spaces.map(space => (
                    <Card key={space.id} className="overflow-hidden">
                      <img 
                        src={space.image} 
                        alt={space.title}
                        className="w-full h-48 object-cover" 
                      />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">{space.title}</h3>
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {space.bookings} reservas
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin size={16} className="mr-1 text-gray-400" />
                            <span className="text-sm">{space.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Home size={16} className="mr-1 text-gray-400" />
                            <span className="text-sm">{space.type}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <User size={16} className="mr-1 text-gray-400" />
                            <span className="text-sm">{space.capacity} pessoas</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <DollarSign size={16} className="mr-1 text-gray-400" />
                            <span>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(space.price)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <a 
                            href={`/espaco/${space.id}`}
                            className="btn-outline text-sm py-2 px-3"
                          >
                            Ver Espaço
                          </a>
                          <a 
                            href={`/espacos/editar/${space.id}`}
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg px-3 py-2 text-sm transition-colors duration-200"
                          >
                            Editar
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reservas">
                <h1 className="text-2xl font-semibold mb-6">Reservas</h1>
                
                <Tabs defaultValue="todas">
                  <TabsList className="mb-6">
                    <TabsTrigger value="todas">Todas</TabsTrigger>
                    <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                    <TabsTrigger value="confirmadas">Confirmadas</TabsTrigger>
                    <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="todas">
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map(booking => (
                          <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4">
                                <img 
                                  src={booking.spaceImage} 
                                  alt={booking.spaceName}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <CardContent className="p-4 md:p-6 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold">{booking.spaceName}</h3>
                                  {renderBookingStatus(booking.status)}
                                </div>
                                
                                <div className="flex items-center mt-2 mb-4">
                                  <img 
                                    src={booking.client.avatar} 
                                    alt={booking.client.name} 
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <span>{booking.client.name}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                  <div className="flex items-center text-gray-600">
                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                    <span>{formatDate(booking.date)}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Clock size={16} className="mr-2 text-gray-400" />
                                    <span>{booking.time}</span>
                                  </div>
                                  {booking.extraServices.length > 0 && (
                                    <div className="md:col-span-2">
                                      <p className="text-sm text-gray-500 mb-1">Serviços extras:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {booking.extraServices.map((service, index) => (
                                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                            {service}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between mt-6">
                                  <div className="font-semibold text-lg">
                                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(booking.price)}
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <button className="border-2 border-primary text-primary hover:bg-primary-light/10 font-medium rounded-lg px-3 py-1 text-sm">
                                      Ver Detalhes
                                    </button>
                                    
                                    {booking.status === "pendente" && (
                                      <>
                                        <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-3 py-1 text-sm">
                                          Aprovar
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-3 py-1 text-sm">
                                          Recusar
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Calendar className="mx-auto text-gray-300 mb-3" size={40} />
                          <h3 className="font-medium text-xl mb-1">Nenhuma reserva encontrada</h3>
                          <p className="text-gray-500">Você ainda não tem reservas para seus espaços.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pendentes">
                    {bookings.filter(b => b.status === "pendente").length > 0 ? (
                      <div className="space-y-4">
                        {bookings
                          .filter(b => b.status === "pendente")
                          .map(booking => (
                            <Card key={booking.id} className="overflow-hidden">
                              {/* Same booking card structure as above */}
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4">
                                  <img 
                                    src={booking.spaceImage} 
                                    alt={booking.spaceName}
                                    className="h-full w-full object-cover" 
                                  />
                                </div>
                                <CardContent className="p-4 md:p-6 flex-1">
                                  {/* Card content same as above */}
                                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">{booking.spaceName}</h3>
                                    {renderBookingStatus(booking.status)}
                                  </div>
                                  
                                  <div className="flex items-center mt-2 mb-4">
                                    <img 
                                      src={booking.client.avatar} 
                                      alt={booking.client.name} 
                                      className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span>{booking.client.name}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                    <div className="flex items-center text-gray-600">
                                      <Calendar size={16} className="mr-2 text-gray-400" />
                                      <span>{formatDate(booking.date)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Clock size={16} className="mr-2 text-gray-400" />
                                      <span>{booking.time}</span>
                                    </div>
                                    {booking.extraServices.length > 0 && (
                                      <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Serviços extras:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {booking.extraServices.map((service, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                              {service}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-6">
                                    <div className="font-semibold text-lg">
                                      {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(booking.price)}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                      <button className="border-2 border-primary text-primary hover:bg-primary-light/10 font-medium rounded-lg px-3 py-1 text-sm">
                                        Ver Detalhes
                                      </button>
                                      <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-3 py-1 text-sm">
                                        Aprovar
                                      </button>
                                      <button className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-3 py-1 text-sm">
                                        Recusar
                                      </button>
                                    </div>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Clock className="mx-auto text-gray-300 mb-3" size={40} />
                          <h3 className="font-medium text-xl mb-1">Nenhuma reserva pendente</h3>
                          <p className="text-gray-500">Todas as suas reservas estão processadas.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="confirmadas">
                    {/* Similar structure for confirmed bookings */}
                    {bookings.filter(b => b.status === "confirmado").length > 0 ? (
                      <div className="space-y-4">
                        {/* Filtered bookings cards */}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <CheckCircle className="mx-auto text-gray-300 mb-3" size={40} />
                          <h3 className="font-medium text-xl mb-1">Nenhuma reserva confirmada</h3>
                          <p className="text-gray-500">Você não tem reservas confirmadas no momento.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="canceladas">
                    {/* Similar structure for cancelled bookings */}
                    {bookings.filter(b => b.status === "cancelado").length > 0 ? (
                      <div className="space-y-4">
                        {/* Filtered bookings cards */}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <XCircle className="mx-auto text-gray-300 mb-3" size={40} />
                          <h3 className="font-medium text-xl mb-1">Nenhuma reserva cancelada</h3>
                          <p className="text-gray-500">Você não tem reservas canceladas.</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="mensagens">
                <h1 className="text-2xl font-semibold mb-6">Mensagens</h1>
                
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <Card key={message.id} className={`${message.unread ? 'border-l-4 border-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <img 
                              src={message.avatar} 
                              alt={message.from}
                              className="w-12 h-12 rounded-full mr-4" 
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{message.from}</h3>
                                <span className="text-gray-500 text-sm">
                                  {new Date(message.date).toLocaleDateString('pt-AO')}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1">{message.message}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <a href="#" className="text-primary hover:underline text-sm">
                              Responder
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageCircle className="mx-auto text-gray-300 mb-3" size={40} />
                      <h3 className="font-medium text-xl mb-1">Nenhuma mensagem</h3>
                      <p className="text-gray-500">Você não tem mensagens para exibir.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="configuracoes">
                <h1 className="text-2xl font-semibold mb-6">Configurações</h1>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Perfil</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Nome Completo
                          </label>
                          <input 
                            type="text" 
                            defaultValue={owner.name}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Email
                          </label>
                          <input 
                            type="email" 
                            defaultValue={owner.email}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Telefone
                          </label>
                          <input 
                            type="tel" 
                            defaultValue={owner.phone}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Preferências de Pagamento</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="kamba" 
                            defaultChecked 
                            className="rounded text-primary focus:ring-primary mr-2"
                          />
                          <label htmlFor="kamba">Aceitar pagamento via Kamba</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="tpa" 
                            defaultChecked 
                            className="rounded text-primary focus:ring-primary mr-2"
                          />
                          <label htmlFor="tpa">Aceitar pagamento via TPA</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="transfer" 
                            defaultChecked 
                            className="rounded text-primary focus:ring-primary mr-2"
                          />
                          <label htmlFor="transfer">Aceitar transferência bancária</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Salvar Alterações
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OwnerDashboard;
