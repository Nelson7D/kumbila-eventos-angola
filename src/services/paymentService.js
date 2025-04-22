
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const paymentService = {
  /**
   * Creates a new payment
   * @param {Object} data - Payment data
   * @param {string} data.reservation_id - Reservation ID
   * @param {number} data.amount - Payment amount
   * @param {string} data.method - Payment method
   * @returns {Promise<Object>}
   */
  async createPayment(data) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Pagamento iniciado",
        description: "Por favor, complete o pagamento seguindo as instruções.",
      });

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro ao iniciar pagamento",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Uploads payment proof file
   * @param {string} paymentId - Payment ID
   * @param {File} file - File to upload
   * @returns {Promise<void>}
   */
  async uploadPaymentProof(paymentId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${paymentId}.${fileExt}`;
      const userResponse = await supabase.auth.getUser();
      const filePath = `${userResponse.data.user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment_receipts')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          payment_proof: publicUrl,
          status: 'pago',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      toast({
        title: "Comprovativo carregado",
        description: "O seu comprovativo foi enviado com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: "Erro ao carregar comprovativo",
        description: "Não foi possível carregar o comprovativo. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets payments for a specific reservation
   * @param {string} reservationId - Reservation ID
   * @returns {Promise<Object>}
   */
  async getPaymentsByReservationId(reservationId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', reservationId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Simulates payment completion for testing
   * @param {string} paymentId - Payment ID
   * @returns {Promise<void>}
   */
  async simulatePayment(paymentId) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'pago',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Pagamento confirmado",
        description: "O seu pagamento foi processado com sucesso.",
      });
    } catch (error) {
      console.error('Error simulating payment:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  }
};
