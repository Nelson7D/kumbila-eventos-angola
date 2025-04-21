
import { format, parseISO, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
}

export function formatDate(dateString: string) {
  try {
    return format(parseISO(dateString), "dd 'de' MMMM", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string) {
  try {
    return format(parseISO(dateString), "HH:mm", { locale: ptBR });
  } catch {
    return "Horário não disponível";
  }
}

export function renderReservationStatus(status: string) {
  switch(status) {
    case "pendente":
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pendente</Badge>;
    case "confirmada":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmada</Badge>;
    case "em_andamento":
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Em andamento</Badge>;
    case "finalizada":
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Finalizada</Badge>;
    case "cancelada":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
}

export function isPastEvent(dateString: string) {
  try {
    const date = parseISO(dateString);
    return isAfter(new Date(), date);
  } catch {
    return false;
  }
}
