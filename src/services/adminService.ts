import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types for admin service
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  user_role: string;
  created_at: string;
  last_sign_in?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AdminSpace {
  id: string;
  name: string;
  location: string;
  type: string;
  owner: {
    id: string;
    full_name: string;
  };
  status: 'active' | 'pending' | 'blocked';
  created_at: string;
  price_per_day: number;
}

export interface AdminReservation {
  id: string;
  user: {
    id: string;
    full_name: string;
  };
  space: {
    id: string;
    name: string;
  };
  start_datetime: string;
  end_datetime: string;
  status: string;
  total_price: number;
  created_at: string;
}

export interface AdminPayment {
  id: string;
  reservation_id: string;
  amount: number;
  status: string;
  method: string;
  paid_at: string | null;
  released_at: string | null;
  reservation: {
    user: {
      full_name: string;
    };
    space: {
      name: string;
    };
  };
}

export interface AdminReview {
  id: string;
  user: {
    id: string;
    full_name: string;
  };
  space: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalSpaces: number;
  totalReservations: number;
  totalPayments: number;
  totalRevenue: number;
  activeReservations: number;
  pendingSpaces: number;
  completionRate: number;
  monthlyStats: Array<{
    month: string;
    reservations: number;
    revenue: number;
  }>;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  admin_id: string;
  admin_name: string;
  created_at: string;
}

const adminService = {
  // Check if the current user has admin role
  async checkAdminAccess() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  },
  
  // Log an admin action for audit purposes
  async logAdminAction(action: string, entityType: string, entityId: string, details: any = {}) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      const { error } = await supabase
        .from('admin_logs')
        .insert({
          action,
          entity_type: entityType,
          entity_id: entityId,
          details,
          admin_id: user.id,
          admin_name: profile?.full_name || user.email
        });
      
      if (error) {
        console.error('Error logging admin action:', error);
      }
    } catch (error) {
      console.error('Error in logAdminAction:', error);
    }
  },
  
  // Dashboard stats
  async getDashboardStats() {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      // Get total spaces
      const { count: totalSpaces } = await supabase
        .from('spaces')
        .select('*', { count: 'exact', head: true });
      
      // Get total reservations
      const { count: totalReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      
      // Get active reservations
      const { count: activeReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .in('status', ['confirmada', 'em_andamento']);
      
      // Get pending spaces
      const { count: pendingSpaces } = await supabase
        .from('spaces')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get payments info
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status');
      
      // Calculate total revenue from finalized payments
      const totalRevenue = payments
        ?.filter(p => p.status === 'liberado' || p.status === 'pago')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      
      const totalPayments = payments?.length || 0;
      
      // Get monthly stats for the last 12 months
      const monthlyStats = await this.getMonthlyStats();

      // Get finished reservations
      const { count: finishedReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'finalizada');
      
      // Calculate completion rate
      const completionRate = totalReservations > 0
        ? (finishedReservations / totalReservations) * 100
        : 0;
      
      return {
        totalUsers: totalUsers || 0,
        totalSpaces: totalSpaces || 0,
        totalReservations: totalReservations || 0,
        totalPayments,
        totalRevenue,
        activeReservations: activeReservations || 0,
        pendingSpaces: pendingSpaces || 0,
        completionRate,
        monthlyStats
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  
  async getMonthlyStats() {
    try {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      // Get date for 12 months ago
      const oneYearAgo = new Date();
      oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);
      
      // Get all reservations from the last 12 months
      const { data: reservations } = await supabase
        .from('reservations')
        .select('start_datetime, total_price')
        .gte('start_datetime', oneYearAgo.toISOString());
      
      // Initialize monthly stats
      const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = (new Date().getMonth() - 11 + i + 12) % 12;
        return {
          month: monthNames[monthIndex],
          reservations: 0,
          revenue: 0
        };
      });
      
      // Process reservations
      if (reservations) {
        reservations.forEach(reservation => {
          const date = new Date(reservation.start_datetime);
          // Find the appropriate month in our result array
          const monthsAgo = (new Date().getMonth() - date.getMonth() + 12) % 12;
          const index = 11 - monthsAgo;
          
          if (index >= 0 && index < 12) {
            monthlyStats[index].reservations += 1;
            monthlyStats[index].revenue += Number(reservation.total_price);
          }
        });
      }
      
      return monthlyStats;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }
  },
  
  // Users management
  async getUsers(search = '', page = 1, limit = 10) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          auth.users!inner(email),
          user_roles(role)
        `, { count: 'exact' });
      
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const users: AdminUser[] = data?.map(user => ({
        id: user.id,
        email: user.email?.email || '',
        full_name: user.full_name || '',
        avatar_url: user.avatar_url,
        user_role: user.user_roles?.[0]?.role || 'user',
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        status: user.status || 'active'
      })) || [];
      
      return { users, total: count || 0 };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
      
      await this.logAdminAction(
        `update_user_status_to_${status}`, 
        'user', 
        userId, 
        { status }
      );
      
      toast({
        title: "Status atualizado com sucesso",
        description: `O usuário agora está ${status}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do usuário.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async resetUserPassword(userId: string, email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      await this.logAdminAction(
        'reset_user_password', 
        'user', 
        userId, 
        { email }
      );
      
      toast({
        title: "Redefinição de senha enviada",
        description: "Um e-mail de redefinição foi enviado para o usuário.",
      });
      
      return true;
    } catch (error) {
      console.error('Error resetting user password:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível enviar o e-mail de redefinição.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Spaces management
  async getSpaces(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('spaces')
        .select(`
          *,
          owner:profiles!spaces_owner_id_fkey(id, full_name)
        `, { count: 'exact' });
      
      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.owner) {
        query = query.ilike('owner.full_name', `%${filters.owner}%`);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const spaces: AdminSpace[] = data?.map(space => ({
        id: space.id,
        name: space.name,
        location: space.location || '',
        type: space.type || '',
        owner: {
          id: space.owner.id,
          full_name: space.owner.full_name || ''
        },
        status: space.status || 'active',
        created_at: space.created_at,
        price_per_day: space.price_per_day
      })) || [];
      
      return { spaces, total: count || 0 };
    } catch (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }
  },
  
  async updateSpaceStatus(spaceId: string, status: 'active' | 'pending' | 'blocked') {
    try {
      const { error } = await supabase
        .from('spaces')
        .update({ status })
        .eq('id', spaceId);
      
      if (error) throw error;
      
      await this.logAdminAction(
        `update_space_status_to_${status}`, 
        'space', 
        spaceId, 
        { status }
      );
      
      toast({
        title: "Status atualizado com sucesso",
        description: `O espaço agora está ${status}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating space status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do espaço.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Reservations management
  async getReservations(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          user:profiles!reservations_user_id_fkey(id, full_name),
          space:spaces!reservations_space_id_fkey(id, name)
        `, { count: 'exact' });
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.startDate) {
        query = query.gte('start_datetime', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('end_datetime', filters.endDate);
      }
      if (filters.spaceId) {
        query = query.eq('space_id', filters.spaceId);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      const { data, error, count } = await query
        .order('start_datetime', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const reservations: AdminReservation[] = data?.map(res => ({
        id: res.id,
        user: {
          id: res.user.id,
          full_name: res.user.full_name || ''
        },
        space: {
          id: res.space.id,
          name: res.space.name
        },
        start_datetime: res.start_datetime,
        end_datetime: res.end_datetime,
        status: res.status,
        total_price: res.total_price,
        created_at: res.created_at
      })) || [];
      
      return { reservations, total: count || 0 };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },
  
  async cancelReservation(reservationId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: 'cancelada',
          updated_at: new Date().toISOString() 
        })
        .eq('id', reservationId);
      
      if (error) throw error;
      
      await this.logAdminAction(
        'cancel_reservation', 
        'reservation', 
        reservationId, 
        { reason }
      );
      
      toast({
        title: "Reserva cancelada com sucesso",
        description: "A reserva foi cancelada pelo administrador.",
      });
      
      return true;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast({
        title: "Erro ao cancelar reserva",
        description: "Não foi possível cancelar a reserva.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Payment management
  async getPayments(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          reservation:reservations!payments_reservation_id_fkey(
            user:profiles!reservations_user_id_fkey(full_name),
            space:spaces!reservations_space_id_fkey(name)
          )
        `, { count: 'exact' });
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.method) {
        query = query.eq('method', filters.method);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const payments: AdminPayment[] = data?.map(payment => ({
        id: payment.id,
        reservation_id: payment.reservation_id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method || '',
        paid_at: payment.paid_at,
        released_at: payment.released_at,
        reservation: {
          user: {
            full_name: payment.reservation?.user?.full_name || ''
          },
          space: {
            name: payment.reservation?.space?.name || ''
          }
        }
      })) || [];
      
      return { payments, total: count || 0 };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
  
  async forceReleasePayment(paymentId: string) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'liberado',
          released_at: new Date().toISOString() 
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      
      await this.logAdminAction(
        'force_release_payment', 
        'payment', 
        paymentId, 
        { }
      );
      
      toast({
        title: "Pagamento liberado com sucesso",
        description: "O pagamento foi liberado manualmente pelo administrador.",
      });
      
      return true;
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast({
        title: "Erro ao liberar pagamento",
        description: "Não foi possível liberar o pagamento.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async markPaymentAsResolved(paymentId: string) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'pago'
        })
        .eq('id', paymentId)
        .eq('status', 'erro');
      
      if (error) throw error;
      
      await this.logAdminAction(
        'resolve_payment_error', 
        'payment', 
        paymentId, 
        { }
      );
      
      toast({
        title: "Erro resolvido com sucesso",
        description: "O pagamento foi marcado como pago.",
      });
      
      return true;
    } catch (error) {
      console.error('Error resolving payment:', error);
      toast({
        title: "Erro ao resolver pagamento",
        description: "Não foi possível resolver o erro de pagamento.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Reviews management
  async getReviews(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!reviews_user_id_fkey(id, full_name),
          space:spaces!reviews_space_id_fkey(id, name)
        `, { count: 'exact' });
      
      // Apply filters
      if (filters.rating) {
        query = query.eq('rating', filters.rating);
      }
      if (filters.spaceId) {
        query = query.eq('space_id', filters.spaceId);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const reviews: AdminReview[] = data?.map(review => ({
        id: review.id,
        user: {
          id: review.user.id,
          full_name: review.user.full_name || ''
        },
        space: {
          id: review.space.id,
          name: review.space.name
        },
        rating: review.rating,
        comment: review.comment || '',
        created_at: review.created_at
      })) || [];
      
      return { reviews, total: count || 0 };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
  
  async deleteReview(reviewId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      await this.logAdminAction(
        'delete_review', 
        'review', 
        reviewId, 
        { reason }
      );
      
      toast({
        title: "Avaliação excluída com sucesso",
        description: "A avaliação foi removida pelo administrador.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Erro ao excluir avaliação",
        description: "Não foi possível excluir a avaliação.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  // Audit logs
  async getAuditLogs(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('admin_logs')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      const logs: AuditLog[] = data || [];
      
      return { logs, total: count || 0 };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  // Export data
  async exportData(type: 'users' | 'spaces' | 'reservations' | 'payments', filters = {}) {
    try {
      let data;
      
      switch (type) {
        case 'users':
          const { users } = await this.getUsers('', 1, 1000); // Get more records for export
          data = users;
          break;
        case 'spaces':
          const { spaces } = await this.getSpaces(filters, 1, 1000);
          data = spaces;
          break;
        case 'reservations':
          const { reservations } = await this.getReservations(filters, 1, 1000);
          data = reservations;
          break;
        case 'payments':
          const { payments } = await this.getPayments(filters, 1, 1000);
          data = payments;
          break;
        default:
          throw new Error('Invalid export type');
      }
      
      await this.logAdminAction(
        'export_data', 
        type, 
        '', 
        { filters }
      );
      
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível gerar o arquivo de exportação.",
        variant: "destructive",
      });
      throw error;
    }
  }
};

export { adminService };
