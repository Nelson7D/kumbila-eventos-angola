import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateReservationData {
  space_id: string;
  start_datetime: Date;
  end_datetime: Date;
  extras?: Record<string, any>;
  total_price: number;
}

export const reservationService = {
  async createReservation(data: CreateReservationData) {
    try {
      const { data: newReservation, error } = await supabase
        .from('reservations')
        .insert({
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          start_datetime: data.start_datetime.toISOString(),
          end_datetime: data.end_datetime.toISOString(),
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar reserva",
          description: "Não foi possível criar sua reserva. Tente novamente.",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Reserva criada com sucesso!",
        description: "Por favor, prossiga com o pagamento.",
      });

      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async getSpaceReservations(spaceId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('space_id', spaceId)
      .eq('status', 'confirmada')
      .gte('start_datetime', new Date().toISOString());

    if (error) throw error;
    return data || [];
  },

  async getUserReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        space:spaces(
          name,
          location
        )
      `);

    if (error) throw error;
    return data || [];
  },

  async cancelReservation(reservationId: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelada' })
        .eq('id', reservationId)
        .single();

      if (error) throw error;

      toast({
        title: "Reserva cancelada com sucesso",
        description: "Sua reserva foi cancelada conforme solicitado.",
      });
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast({
        title: "Erro ao cancelar reserva",
        description: "Não foi possível cancelar sua reserva. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getReservationById(reservationId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (error) throw error;
    return data;
  }
};
