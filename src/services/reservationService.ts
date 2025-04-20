
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
      // Use type assertion to resolve the TypeScript errors
      const { error } = await (supabase.from('reservations') as any).insert({
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) {
        if (error.message.includes('check_reservation_conflicts')) {
          toast({
            title: "Conflito de Horário",
            description: "Este horário já está reservado. Por favor, escolha outro horário.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao criar reserva",
            description: "Não foi possível criar sua reserva. Tente novamente.",
            variant: "destructive",
          });
        }
        throw error;
      }

      toast({
        title: "Reserva criada com sucesso!",
        description: "Aguarde a confirmação do proprietário do espaço.",
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async getSpaceReservations(spaceId: string) {
    // Use type assertion to resolve the TypeScript errors
    const { data, error } = await (supabase
      .from('reservations') as any)
      .select('*')
      .eq('space_id', spaceId)
      .eq('status', 'confirmada')
      .gte('start_datetime', new Date().toISOString());

    if (error) throw error;
    return data || [];
  },

  async getUserReservations() {
    // Use type assertion to resolve the TypeScript errors
    const { data, error } = await (supabase
      .from('reservations') as any)
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
      // Use type assertion to resolve the TypeScript errors
      const { error } = await (supabase
        .from('reservations') as any)
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
  }
};
