
import { format, parseISO, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import React from "react";

/**
 * Formats a number as currency
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
}

/**
 * Formats a date string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  try {
    return format(parseISO(dateString), "dd 'de' MMMM", { locale: ptBR });
  } catch {
    return dateString;
  }
}

/**
 * Formats a time string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time
 */
export function formatTime(dateString) {
  try {
    return format(parseISO(dateString), "HH:mm", { locale: ptBR });
  } catch {
    return "Horário não disponível";
  }
}

/**
 * Renders a reservation status badge
 * @param {string} status - Reservation status
 * @returns {JSX.Element} - Status badge
 */
export function renderReservationStatus(status) {
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

/**
 * Checks if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} - True if the date is in the past
 */
export function isPastEvent(dateString) {
  try {
    const date = parseISO(dateString);
    return isAfter(new Date(), date);
  } catch {
    return false;
  }
}
