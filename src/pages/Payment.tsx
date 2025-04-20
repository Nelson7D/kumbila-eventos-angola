
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { paymentService } from '@/services/paymentService';
import { reservationService } from '@/services/reservationService';
import PaymentForm from '@/components/PaymentForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Payment = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    loadReservationAndPayment();
  }, [reservationId]);

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

  const handlePaymentComplete = () => {
    navigate('/dashboard/usuario');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Reserva não encontrada.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate('/dashboard/usuario')}
            className="mt-4"
          >
            Voltar para o Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (payment?.status === 'pago') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Pagamento já realizado para esta reserva.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate('/dashboard/usuario')}
            className="mt-4"
          >
            Ver Minhas Reservas
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pagamento da Reserva</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PaymentForm
              reservationId={reservationId!}
              amount={reservation.total_price}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
