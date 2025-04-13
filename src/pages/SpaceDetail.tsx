
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceGallery from '@/components/SpaceGallery';
import BookingCalendar from '@/components/BookingCalendar';
import { getSpaceById } from '@/utils/sampleData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star, Clock, Check, Info } from 'lucide-react';

const SpaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const spaceData = getSpaceById(id);
      if (spaceData) {
        setSpace(spaceData);
      }
      setLoading(false);
    }
  }, [id]);
  
  const handleDateTimeSelected = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
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
                  bookedDates={[]}
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
                    
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action w-full flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Reservar via WhatsApp
                    </a>
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
