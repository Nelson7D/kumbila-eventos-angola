
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreatePaymentData {
  reservation_id: string;
  amount: number;
  method: string;
}

export const paymentService = {
  async createPayment(data: CreatePaymentData) {
    try {
      const { error } = await supabase
        .from('payments')
        .insert(data);

      if (error) throw error;

      toast({
        title: "Pagamento iniciado",
        description: "Por favor, complete o pagamento seguindo as instruções.",
      });
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

  async uploadPaymentProof(paymentId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${paymentId}.${fileExt}`;
      const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${fileName}`;

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

  async getPaymentsByReservationId(reservationId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', reservationId)
      .single();

    if (error) throw error;
    return data;
  },

  async simulatePayment(paymentId: string) {
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
