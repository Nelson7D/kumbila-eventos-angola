import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { reservationService } from '@/services/reservationService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceGallery from '@/components/SpaceGallery';
import BookingCalendar from '@/components/BookingCalendar';
import { getSpaceById } from '@/utils/sampleData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star, Clock, Check, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SpaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      const spaceData = getSpaceById(id);
      if (spaceData) {
        setSpace(spaceData);
      }
      setLoading(false);

      // Carregar reservas confirmadas
      loadConfirmedReservations();
    }
  }, [id]);

  const loadConfirmedReservations = async () => {
    try {
      const reservations = await reservationService.getSpaceReservations(id!);
      // Type assertion to ensure TypeScript knows reservations is an array with start_datetime
      const dates = reservations.map((res: any) => new Date(res.start_datetime));
      setBookedDates(dates);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };
  
  const handleDateTimeSelected = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleReservation = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para realizar uma reserva.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione uma data e horário para a reserva.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Converter string de hora para Date
      const [startHour, startMinute] = selectedTime.split(':').map(Number);
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHour, startMinute, 0);

      // Definir horário de término (4 horas após início)
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 4);

      await reservationService.createReservation({
        space_id: id!,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        total_price: space.price,
        extras: {} // Implementar seleção de extras depois
      });

      // Recarregar reservas após criar nova
      await loadConfirmedReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!selectedDate || !selectedTime) return '';
    
    const formattedDate = selectedDate.toLocaleDateString('pt-BR');
    const message = encodeURIComponent(
      `Olá! Gostaria de reservar o espaço "${space.name}" para o dia ${formattedDate}, no horário ${selectedTime}. Por favor, me envie mais informações.`
    );
    
    return `https://wa.me/+244923456789?text=${message}`;
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!space) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Espaço não encontrado</h1>
            <p className="text-gray-600 mb-8">O espaço que você está procurando não está disponível.</p>
            <Link to="/espacos" className="btn-primary inline-block">
              Ver outros espaços
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">Início</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to="/espacos" className="text-gray-500 hover:text-primary">Espaços</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">{space.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-700">{space.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-700">Até {space.capacity} pessoas</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-current mr-1" />
                  <span className="text-gray-700">{space.rating.toFixed(1)} (42 avaliações)</span>
                </div>
                <Badge variant="secondary">{space.type}</Badge>
              </div>
              
              <SpaceGallery images={space.images} name={space.name} />
              
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Sobre o Espaço</h2>
                <p className="text-gray-700 mb-6">{space.description}</p>
                
                <h3 className="text-xl font-semibold mb-3">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {space.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check size={16} className="text-primary mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">Serviços Extras Disponíveis</h3>
                <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {space.extras.map((extra: {name: string, price: number}, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span>{extra.name}</span>
                        <span className="font-medium">{extra.price.toLocaleString('pt-AO')} Kz</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <div className="mb-4">
                  <p className="text-lg font-semibold text-primary">{space.price.toLocaleString('pt-AO')} Kz</p>
                  <p className="text-gray-500 text-sm">por dia</p>
                </div>
                
                <BookingCalendar 
                  onDateTimeSelected={handleDateTimeSelected}
                  bookedDates={bookedDates}
                />
                
                {selectedDate && selectedTime && (
                  <div className="mt-6 animate-fade-in">
                    <div className="bg-primary/10 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <Info size={18} className="mr-2 text-primary" />
                        <p className="font-medium">Resumo da Reserva</p>
                      </div>
                      <div className="flex items-center mt-2">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <p className="text-gray-700">
                          {selectedDate.toLocaleDateString('pt-BR')} • {selectedTime}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={handleReservation}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando...' : 'Confirmar Reserva'}
                    </Button>
                  </div>
                )}
                
                {!selectedDate && (
                  <div className="mt-6">
                    <p className="text-center text-gray-600 text-sm">
                      Selecione uma data e horário para prosseguir com a reserva
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpaceDetail;
