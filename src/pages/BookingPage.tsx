
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Users, Plus, Minus, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [guests, setGuests] = useState(50);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  
  // Mock space data
  const space = {
    id: id || '1',
    title: "Salão de Festas Miramar",
    description: "Espaço elegante para eventos em Luanda com vista para o mar, perfeito para casamentos, aniversários e festas corporativas.",
    image: "/placeholder.svg",
    gallery: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    price: 250000,
    location: "Miramar, Luanda",
    capacity: 150,
    type: "Salão de festas",
    availableTimes: ["14:00 - 18:00", "19:00 - 23:00"],
    owner: {
      name: "Maria Silva",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      phone: "+244 923 456 789"
    }
  };
  
  // Extra services
  const extras = [
    { id: "tables", name: "Mesas e Cadeiras Extra", price: 25000, description: "20 mesas e 80 cadeiras adicionais" },
    { id: "sound", name: "Sistema de Som", price: 30000, description: "Sistema profissional com DJ por 4 horas" },
    { id: "decoration", name: "Decoração Básica", price: 45000, description: "Decoração temática para o evento" },
    { id: "catering", name: "Serviço de Buffet", price: 80000, description: "Buffet para até 100 pessoas" },
    { id: "lighting", name: "Iluminação Especial", price: 35000, description: "Iluminação colorida e efeitos" },
  ];
  
  // Payment methods
  const paymentMethods = [
    { id: "kamba", name: "Kamba", icon: "💸", description: "Pagamento via aplicativo Kamba" },
    { id: "tpa", name: "TPA", icon: "💳", description: "Pagamento com cartão via TPA" },
    { id: "transfer", name: "Transferência Bancária", icon: "🏦", description: "Transferência para conta BFA ou BAI" }
  ];
  
  // Available dates (just for demo purposes - would come from an API)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Exclude some dates to show unavailability
      if (i % 7 !== 0) {
        dates.push({
          date: date.toISOString().split('T')[0],
          available: true
        });
      } else {
        dates.push({
          date: date.toISOString().split('T')[0],
          available: false
        });
      }
    }
    
    return dates;
  };
  
  const availableDates = generateAvailableDates();
  
  // Toggle extra service selection
  const toggleExtra = (extraId) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };
  
  // Calculate total price
  const calculateTotal = () => {
    let total = space.price;
    
    // Add extras cost
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId);
      if (extra) {
        total += extra.price;
      }
    });
    
    return total;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
  };
  
  // Check if date is available
  const isDateAvailable = (dateString) => {
    const dateInfo = availableDates.find(d => d.date === dateString);
    return dateInfo && dateInfo.available;
  };
  
  // Handle date selection
  const handleDateSelect = (dateString) => {
    if (isDateAvailable(dateString)) {
      setSelectedDate(dateString);
    }
  };
  
  // Group dates by month for the calendar view
  const groupDatesByMonth = () => {
    const grouped = {};
    
    availableDates.forEach(dateInfo => {
      const date = new Date(dateInfo.date);
      const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          month: date.toLocaleDateString('pt-AO', { month: 'long' }),
          year: date.getFullYear(),
          dates: []
        };
      }
      
      grouped[monthYear].dates.push(dateInfo);
    });
    
    return Object.values(grouped);
  };
  
  const monthsData = groupDatesByMonth();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-primary p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Reserva de Espaço</h1>
            <p className="mt-2 text-white/80">Complete os detalhes abaixo para reservar {space.title}</p>
          </div>
          
          <div className="p-6">
            {/* Space Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <img 
                src={space.image} 
                alt={space.title}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-lg" 
              />
              <div>
                <h2 className="text-xl font-semibold">{space.title}</h2>
                <p className="text-gray-600 mt-2">{space.description}</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Users size={18} className="text-gray-400 mr-2" />
                    <span>Até {space.capacity} pessoas</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <span>Disponível para reserva</span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">
                      {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(space.price)}
                    </span>
                    <span className="text-gray-500 text-sm"> / diária</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Steps */}
            <Tabs defaultValue="data" className="w-full">
              <TabsList className="mb-6 grid grid-cols-3 bg-white p-0">
                <TabsTrigger value="data" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  1. Data e Hora
                </TabsTrigger>
                <TabsTrigger value="extras" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  2. Serviços Extras
                </TabsTrigger>
                <TabsTrigger value="pagamento" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  3. Pagamento
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Selecione uma data</h3>
                    
                    {monthsData.map((monthData, idx) => (
                      <Card key={idx} className="mb-6">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{monthData.month} {monthData.year}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                              <div key={i} className="p-2 text-sm font-medium text-gray-500">
                                {day}
                              </div>
                            ))}
                            
                            {/* Calculate first day offset */}
                            {Array.from({ length: new Date(monthData.dates[0].date).getDay() }).map((_, i) => (
                              <div key={`empty-${i}`} className="p-2"></div>
                            ))}
                            
                            {monthData.dates.map((dateInfo, i) => {
                              const isSelected = dateInfo.date === selectedDate;
                              const day = new Date(dateInfo.date).getDate();
                              
                              return (
                                <div 
                                  key={i}
                                  onClick={() => dateInfo.available && handleDateSelect(dateInfo.date)}
                                  className={`p-2 rounded-full flex items-center justify-center cursor-pointer ${
                                    isSelected 
                                      ? 'bg-primary text-white' 
                                      : dateInfo.available 
                                        ? 'hover:bg-gray-100' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  {day}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Time Selection & Guest Count */}
                  <div>
                    {selectedDate ? (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-4">Data selecionada</h3>
                          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                            <div className="flex items-center text-green-800">
                              <Check size={20} className="mr-2" />
                              <span className="font-medium">{formatDate(selectedDate)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-8">
                          <h3 className="text-lg font-medium mb-4">Horário disponível</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {space.availableTimes.map((time, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedTimeSlot(time)}
                                className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                                  selectedTimeSlot === time 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-gray-200 hover:border-primary'
                                }`}
                              >
                                <Clock size={18} className="mr-2 text-gray-500" />
                                <span>{time}</span>
                                {selectedTimeSlot === time && (
                                  <Check size={18} className="ml-auto text-primary" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Número de convidados</h3>
                          <div className="flex items-center">
                            <button
                              onClick={() => setGuests(Math.max(10, guests - 10))}
                              className="border border-gray-300 rounded-l-lg p-3 hover:bg-gray-100"
                            >
                              <Minus size={18} />
                            </button>
                            <div className="border-t border-b border-gray-300 p-3 min-w-[80px] text-center">
                              {guests}
                            </div>
                            <button
                              onClick={() => setGuests(Math.min(space.capacity, guests + 10))}
                              className="border border-gray-300 rounded-r-lg p-3 hover:bg-gray-100"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Capacidade máxima: {space.capacity} pessoas</p>
                        </div>
                        
                        {selectedTimeSlot && (
                          <div className="mt-8">
                            <button
                              onClick={() => document.querySelector('[data-value="extras"]').click()}
                              className="btn-primary w-full"
                            >
                              Continuar para Serviços Extras
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Calendar size={48} className="text-gray-300 mb-3" />
                        <h3 className="font-medium text-xl mb-1">Selecione uma data</h3>
                        <p className="text-gray-500">Por favor, escolha uma data disponível no calendário para continuar.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="extras">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Serviços Extras Disponíveis</h3>
                    <div className="space-y-4">
                      {extras.map(extra => (
                        <div
                          key={extra.id}
                          className={`border p-4 rounded-lg cursor-pointer ${
                            selectedExtras.includes(extra.id) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleExtra(extra.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{extra.name}</h4>
                            <div className="font-medium">
                              {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(extra.price)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{extra.description}</p>
                          <div className="flex justify-end mt-2">
                            <div 
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                selectedExtras.includes(extra.id) 
                                  ? 'bg-primary border-primary text-white' 
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedExtras.includes(extra.id) && <Check size={16} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <button
                        onClick={() => document.querySelector('[data-value="pagamento"]').click()}
                        className="btn-primary w-full md:w-auto"
                      >
                        Continuar para Pagamento
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumo da Reserva</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Espaço</h4>
                            <p className="font-medium">{space.title}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Data</h4>
                            <p className="font-medium">{formatDate(selectedDate)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Horário</h4>
                            <p className="font-medium">{selectedTimeSlot}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Convidados</h4>
                            <p className="font-medium">{guests} pessoas</p>
                          </div>
                          
                          <hr />
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Extras selecionados</h4>
                            {selectedExtras.length > 0 ? (
                              <div className="mt-2 space-y-2">
                                {selectedExtras.map(extraId => {
                                  const extra = extras.find(e => e.id === extraId);
                                  return (
                                    <div key={extraId} className="flex justify-between">
                                      <span className="text-sm">{extra.name}</span>
                                      <span className="text-sm font-medium">
                                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(extra.price)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Nenhum extra selecionado</p>
                            )}
                          </div>
                          
                          <hr />
                          
                          <div className="flex justify-between items-center font-medium">
                            <span>Total</span>
                            <span className="text-lg">
                              {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(calculateTotal())}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pagamento">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Escolha seu método de pagamento</h3>
                    
                    <div className="space-y-4 mb-8">
                      {paymentMethods.map(method => (
                        <div
                          key={method.id}
                          className={`border p-4 rounded-lg cursor-pointer ${
                            paymentMethod === method.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{method.icon}</div>
                            <div>
                              <h4 className="font-medium">{method.name}</h4>
                              <p className="text-gray-600 text-sm">{method.description}</p>
                            </div>
                            <div className="ml-auto">
                              <div 
                                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                  paymentMethod === method.id 
                                    ? 'bg-primary border-primary text-white' 
                                    : 'border-gray-300'
                                }`}
                              >
                                {paymentMethod === method.id && <Check size={16} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Informações de Contato</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input 
                            type="email" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="seu.email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone
                          </label>
                          <input 
                            type="tel" 
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="+244 9XX XXX XXX"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      {paymentMethod ? (
                        <button 
                          className="btn-primary w-full md:w-auto"
                          onClick={() => alert('Reserva concluída com sucesso!')}
                        >
                          Finalizar Reserva
                        </button>
                      ) : (
                        <button 
                          className="btn-primary w-full md:w-auto opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Selecione um método de pagamento
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumo da Reserva</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Espaço</h4>
                            <p className="font-medium">{space.title}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Data</h4>
                            <p className="font-medium">{formatDate(selectedDate)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Horário</h4>
                            <p className="font-medium">{selectedTimeSlot}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Convidados</h4>
                            <p className="font-medium">{guests} pessoas</p>
                          </div>
                          
                          <hr />
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Extras selecionados</h4>
                            {selectedExtras.length > 0 ? (
                              <div className="mt-2 space-y-2">
                                {selectedExtras.map(extraId => {
                                  const extra = extras.find(e => e.id === extraId);
                                  return (
                                    <div key={extraId} className="flex justify-between">
                                      <span className="text-sm">{extra.name}</span>
                                      <span className="text-sm font-medium">
                                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(extra.price)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Nenhum extra selecionado</p>
                            )}
                          </div>
                          
                          <hr />
                          
                          <div className="flex justify-between items-center font-medium">
                            <span>Total</span>
                            <span className="text-lg">
                              {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(calculateTotal())}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <img 
                              src={space.owner.avatar} 
                              alt={space.owner.name}
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <h4 className="font-medium">{space.owner.name}</h4>
                              <p className="text-gray-500 text-sm">Proprietário do Espaço</p>
                              <a 
                                href={`https://wa.me/${space.owner.phone.replace(/\s+/g, '')}?text=Olá! Tenho interesse no espaço "${space.title}" e gostaria de mais informações.`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline text-sm inline-block mt-1"
                              >
                                Contatar via WhatsApp
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;
