
import React from 'react';
import { User, Mail, Phone, Star, Calendar, MapPin, Edit } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  // Mock user data
  const user = {
    id: '1',
    name: 'Carlos Mendes',
    email: 'carlos@example.com',
    phone: '+244 923 123 456',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Luanda, Angola',
    joinDate: '2024-01-15',
    bio: 'Olá! Sou Carlos, adoro organizar eventos e encontrar espaços incríveis para minhas celebrações. Sempre em busca de locais únicos e serviços de qualidade.',
  };

  const reviews = [
    {
      id: '1',
      spaceName: 'Salão de Festas Miramar',
      spaceImage: '/placeholder.svg',
      rating: 5,
      date: '2025-03-20',
      comment: 'Espaço incrível! Muito bem localizado e com excelente atendimento. A estrutura é perfeita e todos os convidados adoraram.',
    },
    {
      id: '2',
      spaceName: 'Jardim Talatona',
      spaceImage: '/placeholder.svg',
      rating: 4,
      date: '2024-12-10',
      comment: 'Ambiente agradável e muito bem cuidado. A festa foi um sucesso. Só recomendaria melhorar a iluminação externa para eventos noturnos.',
    },
  ];

  const bookingHistory = [
    {
      id: '1',
      spaceName: 'Salão de Festas Miramar',
      spaceImage: '/placeholder.svg',
      date: '2025-03-15',
      type: 'Aniversário',
      status: 'Concluído',
    },
    {
      id: '2',
      spaceName: 'Jardim Talatona',
      spaceImage: '/placeholder.svg',
      date: '2024-12-05',
      type: 'Casamento',
      status: 'Concluído',
    },
    {
      id: '3',
      spaceName: 'Sala de Conferências Central',
      spaceImage: '/placeholder.svg',
      date: '2025-04-20',
      type: 'Conferência',
      status: 'Agendado',
    }
  ];

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* User Header / Profile Banner */}
          <div className="bg-primary p-6 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover" 
              />
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <div className="flex justify-center md:justify-start items-center mt-2">
                  <MapPin size={18} className="mr-1" />
                  <span>{user.location}</span>
                </div>
                <div className="mt-2 flex justify-center md:justify-start items-center">
                  <Calendar size={18} className="mr-1" />
                  <span>Membro desde {formatDate(user.joinDate)}</span>
                </div>
              </div>
              <div>
                <button className="border border-white text-white hover:bg-white hover:text-primary px-4 py-2 rounded-lg flex items-center transition-colors">
                  <Edit size={18} className="mr-1" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* User Content */}
          <div className="p-6">
            <Tabs defaultValue="sobre" className="w-full">
              <TabsList className="mb-6 bg-white p-1 rounded-lg shadow-sm">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sobre">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-500 mb-1">Sobre mim</h3>
                          <p>{user.bio}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-500 mb-1">Contato</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail size={18} className="text-gray-400 mr-2" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone size={18} className="text-gray-400 mr-2" />
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-500 mb-3">Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-3xl font-semibold text-primary">{bookingHistory.length}</p>
                            <p className="text-gray-500">Reservas</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-3xl font-semibold text-primary">{reviews.length}</p>
                            <p className="text-gray-500">Avaliações</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="avaliacoes">
                <h2 className="text-xl font-semibold mb-4">Avaliações Feitas</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <Card key={review.id}>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start">
                            <img 
                              src={review.spaceImage} 
                              alt={review.spaceName}
                              className="w-16 h-16 rounded-lg object-cover mr-4" 
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{review.spaceName}</h3>
                              <div className="flex items-center mb-1">
                                {renderStars(review.rating)}
                                <span className="ml-2 text-sm text-gray-500">
                                  {formatDate(review.date)}
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Star className="mx-auto text-gray-300 mb-3" size={40} />
                      <h3 className="font-medium text-xl mb-1">Nenhuma avaliação</h3>
                      <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="historico">
                <h2 className="text-xl font-semibold mb-4">Histórico de Reservas</h2>
                {bookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {bookingHistory.map(booking => (
                      <Card key={booking.id}>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-center">
                            <img 
                              src={booking.spaceImage} 
                              alt={booking.spaceName}
                              className="w-16 h-16 rounded-lg object-cover mr-4" 
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{booking.spaceName}</h3>
                                  <p className="text-gray-500 text-sm">{booking.type}</p>
                                </div>
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                  booking.status === 'Concluído' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center mt-2 text-gray-600">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              
                              {booking.status === 'Concluído' && !reviews.some(r => r.spaceName === booking.spaceName) && (
                                <div className="mt-3">
                                  <button className="text-primary hover:underline text-sm flex items-center">
                                    <Star size={16} className="mr-1" />
                                    Deixar uma avaliação
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="mx-auto text-gray-300 mb-3" size={40} />
                      <h3 className="font-medium text-xl mb-1">Nenhuma reserva</h3>
                      <p className="text-gray-500">Você ainda não fez nenhuma reserva.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
