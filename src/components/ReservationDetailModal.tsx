
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  Phone, 
  Mail,
  Package,
  CreditCard,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckinQrModal } from "./CheckinQrModal";

interface ReservationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: any;
  onConfirm: () => void;
  onCancel: () => void;
  onCheckin: () => void;
  onCheckout: () => void;
  isPast: boolean;
  isOwner: boolean;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  open, 
  onOpenChange, 
  reservation,
  onConfirm,
  onCancel,
  onCheckin,
  onCheckout,
  isPast,
  isOwner
}) => {
  const [qrModalOpen, setQrModalOpen] = React.useState(false);
  
  if (!reservation) return null;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: ptBR });
    } catch (e) {
      return "Horário não disponível";
    }
  };
  
  const startDate = formatDate(reservation.start_datetime);
  const startTime = formatTime(reservation.start_datetime);
  const endTime = formatTime(reservation.end_datetime);
  
  const canConfirm = reservation.status === 'pendente' && !isPast;
  const canCancel = ['pendente', 'confirmada'].includes(reservation.status) && !isPast;
  const canCheckin = reservation.status === 'confirmada' && !isPast && isOwner;
  const canCheckout = reservation.status === 'em_andamento' && isOwner;
  const hasExtras = reservation.extras && Object.keys(reservation.extras).length > 0;
  
  const renderPaymentStatus = () => {
    const payment = reservation.payment?.[0];
    if (!payment) return <span className="text-yellow-600">Pagamento não registrado</span>;
    
    switch (payment.status) {
      case 'pago':
        return (
          <span className="text-green-600 flex items-center gap-1">
            <Check size={16} /> Pago ({format(new Date(payment.paid_at), "dd/MM/yyyy")})
          </span>
        );
      case 'pendente':
        return <span className="text-yellow-600">Pendente</span>;
      case 'cancelado':
        return <span className="text-red-600">Cancelado</span>;
      default:
        return <span>{payment.status}</span>;
    }
  };
  
  const renderStatusBadge = () => {
    switch (reservation.status) {
      case 'pendente':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Pendente</span>;
      case 'confirmada':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Confirmada</span>;
      case 'em_andamento':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Em andamento</span>;
      case 'finalizada':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Finalizada</span>;
      case 'cancelada':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Cancelada</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{reservation.status}</span>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Detalhes da Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{reservation.space?.name}</h3>
              {renderStatusBadge()}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-gray-400" size={16} />
                <span>{startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-gray-400" size={16} />
                <span>{startTime} - {endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="text-gray-400" size={16} />
                <span>{reservation.space?.location || 'Sem localização específica'}</span>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2">Cliente</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="text-gray-400" size={16} />
                  <span>{reservation.user?.full_name || 'Nome não disponível'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-gray-400" size={16} />
                  <span>{reservation.user?.phone || 'Telefone não disponível'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-gray-400" size={16} />
                  <span>{reservation.user?.email || 'Email não disponível'}</span>
                </div>
              </div>
            </div>
            
            {hasExtras && (
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Package size={16} />
                  Extras
                </h4>
                <ul className="space-y-1 text-sm">
                  {Object.entries(reservation.extras).map(([key, value]: [string, any]) => (
                    <li key={key} className="flex justify-between">
                      <span>{key}</span>
                      <span className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <CreditCard size={16} />
                Pagamento
              </h4>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                {renderPaymentStatus()}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Valor total:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(reservation.total_price)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Método:</span>
                <span>{reservation.payment?.[0]?.method || 'Não informado'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-3">
              {canConfirm && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-1" 
                  onClick={onConfirm}
                >
                  <Check size={16} />
                  Confirmar
                </Button>
              )}
              
              {canCancel && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="gap-1" 
                  onClick={onCancel}
                >
                  <X size={16} />
                  Cancelar
                </Button>
              )}
              
              {canCheckin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 border-blue-500 text-blue-500 hover:bg-blue-50" 
                  onClick={onCheckin}
                >
                  <Check size={16} />
                  Check-in Manual
                </Button>
              )}
              
              {canCheckout && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 border-green-500 text-green-500 hover:bg-green-50" 
                  onClick={onCheckout}
                >
                  <Check size={16} />
                  Check-out Manual
                </Button>
              )}
              
              {isOwner && reservation.status !== 'cancelada' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQrModalOpen(true)}
                >
                  Ver QR do Cliente
                </Button>
              )}
            </div>
          </div>
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="mt-2">Fechar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      
      {reservation && (
        <CheckinQrModal
          open={qrModalOpen}
          onOpenChange={setQrModalOpen}
          reservation={{
            id: reservation.id,
            spaceName: reservation.space?.name || '',
            date: startDate,
            time: `${startTime} - ${endTime}`,
            location: reservation.space?.location,
            status: reservation.status,
            checkinDone: reservation.status === 'em_andamento' || reservation.status === 'finalizada',
            checkoutDone: reservation.status === 'finalizada'
          }}
        />
      )}
    </>
  );
};
