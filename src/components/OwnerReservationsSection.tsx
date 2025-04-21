
import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Check, X, Calendar } from "lucide-react";
import { formatCurrency, formatDate, formatTime, renderReservationStatus } from "@/utils/ownerDashboardUtils";

export default function OwnerReservationsSection({
  loading,
  reservations,
  onViewReservationDetails
}: {
  loading: boolean;
  reservations: any[];
  onViewReservationDetails: (reservation: any) => void;
}) {
  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex justify-center">
          <p className="text-gray-500">Carregando reservas...</p>
        </div>
      </Card>
    );
  }
  if (!reservations.length) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <Calendar size={48} className="mx-auto text-gray-300" />
          <h3 className="text-lg font-medium">Nenhuma reserva encontrada</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Você ainda não possui reservas recebidas para seus espaços.
            Elas aparecerão aqui quando clientes fizerem reservas.
          </p>
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Espaço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map(reservation => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">
                  {reservation.user?.full_name || "Cliente"}
                </TableCell>
                <TableCell>{reservation.space?.name || "Espaço"}</TableCell>
                <TableCell>{formatDate(reservation.start_datetime)}</TableCell>
                <TableCell>{formatTime(reservation.start_datetime)}</TableCell>
                <TableCell>{formatCurrency(reservation.total_price)}</TableCell>
                <TableCell>{renderReservationStatus(reservation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewReservationDetails(reservation)}
                    >
                      <Info size={16} />
                      <span className="sr-only">Ver detalhes</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
