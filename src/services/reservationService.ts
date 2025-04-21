
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
  },
  
  // New functions for owner dashboard
  async getOwnerReservations() {
    try {
      const { data: userSpaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (spacesError) throw spacesError;
      
      if (!userSpaces || userSpaces.length === 0) {
        return [];
      }
      
      const spaceIds = userSpaces.map(space => space.id);
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          user:profiles!reservations_user_id_fkey(full_name, avatar_url),
          space:spaces!reservations_space_id_fkey(name, location, type),
          payment:payments(status, method, amount, paid_at)
        `)
        .in('space_id', spaceIds)
        .order('start_datetime', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching owner reservations:', error);
      throw error;
    }
  },
  
  async getOwnerSpaces() {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select(`
          *,
          reservations:reservations(id, status),
          reviews:reviews(rating)
        `)
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching owner spaces:', error);
      throw error;
    }
  },
  
  async updateReservationStatus(reservationId: string, status: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reservationId);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado com sucesso",
        description: `A reserva agora está ${status}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da reserva.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async performManualCheckin(reservationId: string) {
    try {
      // First check if check-in already exists
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();
      
      if (existingCheckin?.checkin_time) {
        toast({
          title: "Check-in já realizado",
          description: "Esta reserva já possui um check-in registrado.",
          variant: "warning",
        });
        return false;
      }
      
      // Create or update check-in record
      const { error } = await supabase
        .from('checkins')
        .upsert({ 
          reservation_id: reservationId, 
          checkin_time: new Date().toISOString(),
          verified_by_owner: true
        });
      
      if (error) throw error;
      
      // Update reservation status
      await supabase
        .from('reservations')
        .update({ 
          status: 'em_andamento', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', reservationId);
      
      toast({
        title: "Check-in realizado com sucesso",
        description: "O status da reserva foi atualizado para 'em andamento'.",
      });
      
      return true;
    } catch (error) {
      console.error('Error performing manual check-in:', error);
      toast({
        title: "Erro ao realizar check-in",
        description: "Não foi possível registrar o check-in.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async performManualCheckout(reservationId: string) {
    try {
      // First check if check-in exists
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('*')
        .eq('reservation_id', reservationId)
        .maybeSingle();
      
      if (!existingCheckin?.checkin_time) {
        toast({
          title: "Check-in não realizado",
          description: "É necessário realizar o check-in antes do check-out.",
          variant: "warning",
        });
        return false;
      }
      
      if (existingCheckin.checkout_time) {
        toast({
          title: "Check-out já realizado",
          description: "Esta reserva já possui um check-out registrado.",
          variant: "warning",
        });
        return false;
      }
      
      // Update check-in record with checkout time
      const { error } = await supabase
        .from('checkins')
        .update({ 
          checkout_time: new Date().toISOString(),
          verified_by_owner: true 
        })
        .eq('reservation_id', reservationId);
      
      if (error) throw error;
      
      // Update reservation status
      await supabase
        .from('reservations')
        .update({ 
          status: 'finalizada', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', reservationId);
      
      toast({
        title: "Check-out realizado com sucesso",
        description: "O status da reserva foi atualizado para 'finalizada'.",
      });
      
      return true;
    } catch (error) {
      console.error('Error performing manual check-out:', error);
      toast({
        title: "Erro ao realizar check-out",
        description: "Não foi possível registrar o check-out.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Analytics functions
  async getOwnerReservationStats(timeframe = 'year') {
    try {
      const { data: userSpaces, error: spacesError } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (spacesError) throw spacesError;
      
      if (!userSpaces || userSpaces.length === 0) {
        return {
          totalReservations: 0,
          confirmedReservations: 0,
          cancelledReservations: 0,
          revenue: 0,
          averageRating: 0,
          monthlyData: []
        };
      }
      
      const spaceIds = userSpaces.map(space => space.id);
      
      // Set date range based on timeframe
      let startDate = new Date();
      if (timeframe === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      } else if (timeframe === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeframe === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      }
      
      // Get all reservations for owner's spaces
      const { data, error } = await supabase
        .from('reservations')
        .select('id, status, total_price, start_datetime, space_id')
        .in('space_id', spaceIds)
        .gte('start_datetime', startDate.toISOString());
      
      if (error) throw error;
      
      // Get all reviews for owner's spaces
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .in('space_id', spaceIds);
      
      if (reviewsError) throw reviewsError;
      
      // Calculate statistics
      const stats = {
        totalReservations: data?.length || 0,
        confirmedReservations: data?.filter(r => ['confirmada', 'em_andamento', 'finalizada'].includes(r.status))?.length || 0,
        cancelledReservations: data?.filter(r => r.status === 'cancelada')?.length || 0,
        revenue: data?.reduce((sum, res) => sum + (res.status !== 'cancelada' ? Number(res.total_price) : 0), 0) || 0,
        averageRating: reviews?.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
        completionRate: data?.length ? 
          (data?.filter(r => r.status === 'finalizada')?.length / data?.length) * 100 : 0,
        monthlyData: this.calculateMonthlyData(data || [])
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching owner statistics:', error);
      throw error;
    }
  },
  
  calculateMonthlyData(reservations: any[]) {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyData = monthNames.map(month => ({
      month,
      bookings: 0,
      revenue: 0
    }));
    
    reservations.forEach(reservation => {
      const date = new Date(reservation.start_datetime);
      const monthIndex = date.getMonth();
      
      monthlyData[monthIndex].bookings += 1;
      
      // Only add to revenue if reservation wasn't canceled
      if (reservation.status !== 'cancelada') {
        monthlyData[monthIndex].revenue += Number(reservation.total_price);
      }
    });
    
    return monthlyData;
  }
};
