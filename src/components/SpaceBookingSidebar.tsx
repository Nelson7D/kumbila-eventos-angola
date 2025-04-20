
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Info, Clock } from 'lucide-react';
import BookingCalendar from '@/components/BookingCalendar';
import { reservationService } from '@/services/reservationService';

interface SpaceBookingSidebarProps {
  spaceId: string;
  price: number;
  bookedDates: Date[];
  onReservationComplete: () => void;
}

const SpaceBookingSidebar = ({ spaceId, price, bookedDates, onReservationComplete }: SpaceBookingSidebarProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const [startHour, startMinute] = selectedTime.split(':').map(Number);
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHour, startMinute, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 4);

      await reservationService.createReservation({
        space_id: spaceId,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        total_price: price,
        extras: {}
      });

      onReservationComplete();
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
      <div className="mb-4">
        <p className="text-lg font-semibold text-primary">{price.toLocaleString('pt-AO')} Kz</p>
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
  );
};

export default SpaceBookingSidebar;
