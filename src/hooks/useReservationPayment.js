
import { useState, useEffect } from 'react';
import { reservationService } from '@/services/reservationService';
import { paymentService } from '@/services/paymentService';

/**
 * Custom hook for handling reservation payment data
 * @param {string} reservationId - The reservation ID
 * @returns {Object} Reservation payment data and loading state
 */
export const useReservationPayment = (reservationId) => {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const loadReservationAndPayment = async () => {
      try {
        if (!reservationId) return;

        const reservationData = await reservationService.getReservationById(reservationId);
        setReservation(reservationData);

        try {
          const paymentData = await paymentService.getPaymentsByReservationId(reservationId);
          setPayment(paymentData);
        } catch (error) {
          // Payment might not exist yet, which is fine
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadReservationAndPayment();
  }, [reservationId]);

  return { loading, reservation, payment };
};
