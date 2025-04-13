
import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Star, Home, FileText, User, 
  LogOut, Heart, Settings, MessageCircle, RotateCcw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("reservas");

  // Mock data
  const user = {
    name: "Carlos Mendes",
    email: "carlos@example.com",
    phone: "+244 923 123 456",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const bookings = [
    {
      id: "1",
      spaceName: "Salão de Festas Miramar",
      spaceImage: "/placeholder.svg",
      date: "2025-04-20",
      time: "18:00 - 23:00",
      price: 250000,
      status: "confirmado",
      location: "Miramar, Luanda"
    },
    {
      id: "2",
      spaceName: "Jardim Talatona",
      spaceImage: "/placeholder.svg",
      date: "2025-05-15",
      time: "15:00 - 20:00",
      price: 180000,
      status: "pendente",
      location: "Talatona, Luanda"
    },
    {
      id: "3",
      spaceName: "Sala de Conferências Central",
      spaceImage: "/placeholder.svg",
      date: "2025-03-10",
      time: "09:00 - 17:00",
      price: 150000,
      status: "concluído",
      location: "Centro, Luanda"
    }
  ];

  const favorites = [
    {
      id: "101",
      name: "Salão Estrela",
      image: "/placeholder.svg",
      price: 320000,
      location: "Miramar, Luanda",
      type: "Salão de festas"
    },
    {
      id: "102",
      name: "Terraço Panorâmico",
      image: "/placeholder.svg",
      price: 280000,
      location: "Ingombota, Luanda",
      type: "Espaço ao ar livre"
    }
  ];

  const messages = [
    {
      id: "1",
      from: "Maria Silva",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Olá! Confirmo a disponibilidade para dia 20 de Abril.",
      date: "2025-04-01T10:30:00",
      unread: true
    },
    {
      id: "2",
      from: "João Paulo",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      message: "Obrigado pela sua reserva! Alguma dúvida sobre o espaço?",
      date: "2025-03-29T14:15:00",
      unread: false
    }
  ];

  const renderBookingStatus = (status) => {
    switch(status) {
      case "confirmado":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmado</span>;
      case "pendente":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pendente</span>;
      case "concluído":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Concluído</span>;
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
                  src={user.avatar} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover" 
                />
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab("reservas")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "reservas" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <Calendar size={18} className="mr-3" />
                  Minhas Reservas
                </button>
                <button 
                  onClick={() => setActiveTab("favoritos")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "favoritos" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <Heart size={18} className="mr-3" />
                  Favoritos
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
                  onClick={() => setActiveTab("perfil")}
                  className={`w-full flex items-center p-2 rounded-lg ${activeTab === "perfil" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <User size={18} className="mr-3" />
                  Meu Perfil
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
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-white p-1 rounded-lg shadow-sm">
                <TabsTrigger value="reservas" className="flex-1">Reservas</TabsTrigger>
                <TabsTrigger value="favoritos" className="flex-1">Favoritos</TabsTrigger>
                <TabsTrigger value="mensagens" className="flex-1">Mensagens</TabsTrigger>
                <TabsTrigger value="perfil" className="flex-1">Perfil</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reservas">
                <h1 className="text-2xl font-semibold mb-6">Minhas Reservas</h1>
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-4">
                              <div className="flex items-center text-gray-600">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin size={16} className="mr-2 text-gray-400" />
                                <span>{booking.location}</span>
                              </div>
                              <div className="font-medium">
                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(booking.price)}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                              <a 
                                href={`/reserva/${booking.id}`}
                                className="btn-outline text-sm py-2"
                              >
                                Ver Detalhes
                              </a>
                              
                              {booking.status === "confirmado" && (
                                <button className="flex items-center space-x-1 border border-orange-500 text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm">
                                  <RotateCcw size={16} />
                                  <span>Reagendar</span>
                                </button>
                              )}
                              
                              {booking.status === "concluído" && (
                                <button className="flex items-center space-x-1 border border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-3 py-2 rounded-lg text-sm">
                                  <Star size={16} />
                                  <span>Avaliar</span>
                                </button>
                              )}
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
                      <p className="text-gray-500 mb-4">Você ainda não fez nenhuma reserva de espaço.</p>
                      <a href="/espacos" className="btn-primary inline-flex">
                        Explorar Espaços
                      </a>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="favoritos">
                <h1 className="text-2xl font-semibold mb-6">Meus Favoritos</h1>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map(space => (
                      <Card key={space.id} className="overflow-hidden">
                        <img 
                          src={space.image} 
                          alt={space.name}
                          className="w-full h-48 object-cover" 
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{space.name}</h3>
                          <div className="flex items-center text-gray-600 mt-2">
                            <MapPin size={16} className="mr-1 text-gray-400" />
                            <span className="text-sm">{space.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Home size={16} className="mr-1 text-gray-400" />
                            <span className="text-sm">{space.type}</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-semibold">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(space.price)}</span>
                            <a 
                              href={`/espaco/${space.id}`}
                              className="text-primary hover:underline"
                            >
                              Ver detalhes
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Heart className="mx-auto text-gray-300 mb-3" size={40} />
                      <h3 className="font-medium text-xl mb-1">Nenhum favorito</h3>
                      <p className="text-gray-500 mb-4">Você ainda não adicionou nenhum espaço aos favoritos.</p>
                      <a href="/espacos" className="btn-primary inline-flex">
                        Explorar Espaços
                      </a>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="mensagens">
                <h1 className="text-2xl font-semibold mb-6">Minhas Mensagens</h1>
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
              
              <TabsContent value="perfil">
                <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-32 h-32 rounded-full mb-4" 
                        />
                        <button className="text-primary hover:underline text-sm">
                          Alterar foto
                        </button>
                      </div>
                      <div className="md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Nome Completo
                            </label>
                            <input 
                              type="text" 
                              value={user.name}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Email
                            </label>
                            <input 
                              type="email" 
                              value={user.email}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Telefone
                            </label>
                            <input 
                              type="tel" 
                              value={user.phone}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                              Senha
                            </label>
                            <input 
                              type="password" 
                              value="********"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <button className="btn-primary">
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="configuracoes">
                <h1 className="text-2xl font-semibold mb-6">Configurações</h1>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Notificações</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificações por email</p>
                            <p className="text-sm text-gray-500">Receba atualizações sobre suas reservas</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificações por SMS</p>
                            <p className="text-sm text-gray-500">Receba confirmações por SMS</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Privacidade</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Perfil público</p>
                            <p className="text-sm text-gray-500">Permitir que outros usuários vejam meu perfil</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn-primary">
                        Salvar Configurações
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

export default UserDashboard;
