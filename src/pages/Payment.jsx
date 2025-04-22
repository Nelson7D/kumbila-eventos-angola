
import { useParams, useNavigate } from 'react-router-dom';
import PaymentForm from '@/components/PaymentForm';
import PaymentStatus from '@/components/payment/PaymentStatus';
import PaymentContainer from '@/components/payment/PaymentContainer';
import { useReservationPayment } from '@/hooks/useReservationPayment';

/**
 * Payment page component
 */
const Payment = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { loading, reservation, payment } = useReservationPayment(reservationId);

  const handlePaymentComplete = () => {
    navigate('/dashboard/usuario');
  };

  return (
    <PaymentContainer>
      {loading && <PaymentStatus status="loading" />}
      
      {!loading && !reservation && <PaymentStatus status="not_found" />}
      
      {!loading && payment?.status === 'pago' && (
        <PaymentStatus status="already_paid" />
      )}

      {!loading && reservation && (!payment || payment.status !== 'pago') && (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pagamento da Reserva</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PaymentForm
              reservationId={reservationId}
              amount={reservation.total_price}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </div>
      )}
    </PaymentContainer>
  );
};

export default Payment;
