
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Check, QrCode, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface CheckinQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: {
    id: string;
    spaceName: string;
    date: string;
    time: string;
    location?: string;
    status: string;
    checkinDone?: boolean;
    checkoutDone?: boolean;
  };
}

export const CheckinQrModal: React.FC<CheckinQrModalProps> = ({
  open, onOpenChange, reservation,
}) => {
  const qrUrl = `${window.location.origin}/api/v1/checkin/${reservation.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="text-blue-600" size={24}/>
            <DialogTitle className="text-xl font-bold">Apresente este QR no dia do evento</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center bg-white px-8 pb-6 pt-4 rounded-b-lg shadow-md">
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-3">
            <QRCodeCanvas value={qrUrl} size={180} fgColor="#1B2D69" bgColor="#fff" level="H" />
          </div>
          <div className="mt-2 text-center space-y-2 w-full">
            <div className="flex flex-col items-center">
              <span className="font-semibold">{reservation.spaceName}</span>
              <span className="text-gray-500 text-xs flex items-center justify-center gap-1">
                <Calendar size={14} /> {reservation.date} &nbsp;
                <Clock size={14} /> {reservation.time}
              </span>
              {reservation.location && (
                <span className="text-gray-400 text-xs flex items-center justify-center gap-1">
                  <MapPin size={12} /> {reservation.location}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs rounded-full px-2 py-1 bg-blue-50 text-blue-700 font-medium">
                {reservation.status === "confirmado" || reservation.status === "pago"
                  ? "Aguardando check-in"
                  : reservation.status}
              </span>
              {reservation.checkinDone && (
                <span className="inline-flex items-center gap-1 px-2 text-green-700 bg-green-100 rounded-full text-xs">
                  <Check size={14}/> Check-in realizado
                </span>
              )}
              {reservation.checkoutDone && (
                <span className="inline-flex items-center gap-1 px-2 text-yellow-700 bg-yellow-100 rounded-full text-xs">
                  <Check size={14}/> Evento concluído
                </span>
              )}
            </div>
            <DialogDescription>
              O anfitrião escaneará este código para validar sua presença. 
              Este QR é válido apenas durante o evento e expira após o horário limite.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button className="mt-4 btn-outline w-full flex items-center justify-center gap-2">
              <X size={16} /> Fechar
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

