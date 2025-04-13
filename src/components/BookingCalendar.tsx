
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown } from 'lucide-react';

interface BookingCalendarProps {
  onDateTimeSelected: (date: Date, timeSlot: string) => void;
  bookedDates?: Date[];
}

const BookingCalendar = ({ onDateTimeSelected, bookedDates = [] }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const timeSlots = [
    "08:00 - 12:00",
    "12:00 - 16:00",
    "16:00 - 20:00",
    "Dia inteiro"
  ];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setShowTimeSlots(!!date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelected(selectedDate, time);
    }
  };
  
  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h3 className="font-semibold mb-4">Disponibilidade</h3>
      
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="pointer-events-auto"
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || isDateBooked(date);
          }}
        />
      </div>
      
      {showTimeSlots && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center mb-2">
            <Clock size={18} className="mr-2 text-gray-500" />
            <h4 className="font-medium">Selecionar horário</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={selectedTime === time ? "bg-primary" : ""}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
            <span className="text-xs text-gray-500">Não disponível</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
            <span className="text-xs text-gray-500">Selecionado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
