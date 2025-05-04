
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  AdminUser, 
  AdminSpace, 
  AdminDashboardStats, 
  FilterOptions, 
  AuditLog, 
  PaginatedResult 
} from '@/types/admin';

/**
 * Service for admin operations
 */
export const adminService = {
  /**
   * Check if the current user has admin access
   * @returns {Promise<boolean>} Whether the user has admin access
   */
  async checkAdminAccess(): Promise<boolean> {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      // Check if user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  },

  /**
   * Get dashboard statistics
   * @returns {Promise<AdminDashboardStats>} Dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const [usersResponse, spacesResponse, reservationsResponse, paymentsResponse] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('spaces').select('*'),
        supabase.from('reservations').select('*'),
        supabase.from('payments').select('*')
      ]);
      
      if (usersResponse.error) throw usersResponse.error;
      if (spacesResponse.error) throw spacesResponse.error;
      if (reservationsResponse.error) throw reservationsResponse.error;
      if (paymentsResponse.error) throw paymentsResponse.error;
      
      const users = usersResponse.data || [];
      const spaces = spacesResponse.data || [];
      const reservations = reservationsResponse.data || [];
      const payments = paymentsResponse.data || [];
      
      const totalRevenue = payments
        .filter(payment => payment.status === 'pago')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);
      
      const activeReservations = reservations.filter(
        res => res.status === 'confirmada' || res.status === 'em_andamento'
      ).length;
      
      const pendingSpaces = spaces.filter(space => space.status === 'pending').length;
      
      const completedReservations = reservations.filter(res => res.status === 'finalizada').length;
      const completionRate = reservations.length > 0 
        ? (completedReservations / reservations.length) * 100 
        : 0;
        
      // Generate monthly statistics for the last 6 months
      const now = new Date();
      const monthlyStats = [];
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleString('default', { month: 'short' });
        
        const monthReservations = reservations.filter(res => {
          const resDate = new Date(res.created_at);
          return resDate.getMonth() === month.getMonth() && 
                 resDate.getFullYear() === month.getFullYear();
        });
        
        const monthRevenue = payments
          .filter(payment => {
            if (payment.status !== 'pago' || !payment.paid_at) return false;
            const payDate = new Date(payment.paid_at);
            return payDate.getMonth() === month.getMonth() && 
                   payDate.getFullYear() === month.getFullYear();
          })
          .reduce((sum, payment) => sum + Number(payment.amount), 0);
        
        monthlyStats.push({
          month: monthName,
          reservations: monthReservations.length,
          revenue: monthRevenue
        });
      }
      
      return {
        totalUsers: users.length,
        totalSpaces: spaces.length,
        totalReservations: reservations.length,
        totalPayments: payments.filter(p => p.status === 'pago').length,
        totalRevenue,
        activeReservations,
        pendingSpaces,
        completionRate,
        monthlyStats
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: error.message || "Ocorreu um erro ao carregar as estatísticas do dashboard.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Get all users
   * @param {string} search - Search term
   * @param {number} page - Page number
   * @param {number} pageSize - Number of users per page
   * @returns {Promise<PaginatedResult<AdminUser>>} Object with users and total count
   */
  async getUsers(search: string = '', page: number = 1, pageSize: number = 10): Promise<PaginatedResult<AdminUser>> {
    try {
      const startIndex = (page - 1) * pageSize;
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .ilike('full_name', `%${search}%`)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
  
      const { data, error, count } = await query;
  
      if (error) throw error;
  
      const users = data || [];
      const total = count || 0;
  
      return { data: users as AdminUser[], total };
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Ocorreu um erro ao carregar a lista de usuários.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated user
   */
  async updateUserStatus(userId: string, status: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: userId,
        entityType: 'user',
        action: `update_status_to_${status}`,
      });
      
      toast({
        title: "Status atualizado",
        description: `O status do usuário foi alterado para ${status}.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do usuário.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      // This requires admin privileges
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: userId,
        entityType: 'user',
        action: 'delete',
      });
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Get all spaces
   * @param {FilterOptions} options - Query options
   * @param {number} page - Page number
   * @param {number} pageSize - Number of spaces per page
   * @returns {Promise<PaginatedResult<AdminSpace>>} List of admin spaces
   */
  async getSpaces(options: FilterOptions = {}, page: number = 1, pageSize: number = 10): Promise<PaginatedResult<AdminSpace>> {
    try {
      const { searchTerm = '', status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      const startIndex = (page - 1) * pageSize;
      
      let query = supabase
        .from('spaces')
        .select(`
          *,
          owner:owner_id(id, full_name)
        `, { count: 'exact' })
        .ilike('name', `%${searchTerm}%`)
        .order(sortBy, { ascending: sortDirection === 'asc' })
        .range(startIndex, startIndex + pageSize - 1);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data: data as AdminSpace[] || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching spaces:', error);
      toast({
        title: "Erro ao carregar espaços",
        description: error.message || "Ocorreu um erro ao carregar a lista de espaços.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Update space status
   * @param {string} spaceId - Space ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated space
   */
  async updateSpaceStatus(spaceId: string, status: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .update({ status })
        .eq('id', spaceId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: spaceId,
        entityType: 'space',
        action: `update_status_to_${status}`,
      });
      
      toast({
        title: "Status atualizado",
        description: `O status do espaço foi alterado para ${status}.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating space status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do espaço.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Delete space
   * @param {string} spaceId - Space ID
   * @returns {Promise<void>}
   */
  async deleteSpace(spaceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', spaceId);
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: spaceId,
        entityType: 'space',
        action: 'delete',
      });
      
      toast({
        title: "Espaço excluído",
        description: "O espaço foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting space:', error);
      toast({
        title: "Erro ao excluir espaço",
        description: error.message || "Ocorreu um erro ao excluir o espaço.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Get all reservations
   * @param {FilterOptions} options - Query options
   * @param {number} page - Page number
   * @param {number} pageSize - Number of reservations per page
   * @returns {Promise<PaginatedResult<any>>} List of reservations
   */
  async getReservations(options: FilterOptions = {}, page: number = 1, pageSize: number = 10): Promise<PaginatedResult<any>> {
    try {
      const { status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      const startIndex = (page - 1) * pageSize;
      
      let query = supabase
        .from('reservations')
        .select(`
          *,
          space:space_id(id, name),
          user:user_id(id, full_name)
        `, { count: 'exact' })
        .order(sortBy, { ascending: sortDirection === 'asc' })
        .range(startIndex, startIndex + pageSize - 1);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Erro ao carregar reservas",
        description: error.message || "Ocorreu um erro ao carregar a lista de reservas.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Cancel reservation
   * @param {string} reservationId - Reservation ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated reservation
   */
  async cancelReservation(reservationId: string, reason: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'cancelada' })
        .eq('id', reservationId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: reservationId,
        entityType: 'reservation',
        action: 'cancel',
        details: { reason }
      });
      
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast({
        title: "Erro ao cancelar reserva",
        description: error.message || "Ocorreu um erro ao cancelar a reserva.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Update reservation status
   * @param {string} reservationId - Reservation ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated reservation
   */
  async updateReservationStatus(reservationId: string, status: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: reservationId,
        entityType: 'reservation',
        action: `update_status_to_${status}`,
      });
      
      toast({
        title: "Status atualizado",
        description: `O status da reserva foi alterado para ${status}.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status da reserva.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Get all payments
   * @param {FilterOptions} options - Query options
   * @param {number} page - Page number
   * @param {number} pageSize - Number of payments per page
   * @returns {Promise<PaginatedResult<any>>} List of payments
   */
  async getPayments(options: FilterOptions = {}, page: number = 1, pageSize: number = 10): Promise<PaginatedResult<any>> {
    try {
      const { status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      const startIndex = (page - 1) * pageSize;
      
      let query = supabase
        .from('payments')
        .select(`
          *,
          reservation:reservation_id(
            id, 
            user_id,
            user:user_id(full_name),
            space:space_id(name, owner_id)
          )
        `, { count: 'exact' })
        .order(sortBy, { ascending: sortDirection === 'asc' })
        .range(startIndex, startIndex + pageSize - 1);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erro ao carregar pagamentos",
        description: error.message || "Ocorreu um erro ao carregar a lista de pagamentos.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Update payment status
   * @param {string} paymentId - Payment ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated payment
   */
  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    try {
      const updates: any = { status };
      
      if (status === 'pago') {
        updates.paid_at = new Date().toISOString();
      } else if (status === 'liberado') {
        updates.released_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', paymentId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: paymentId,
        entityType: 'payment',
        action: `update_status_to_${status}`,
      });
      
      toast({
        title: "Status atualizado",
        description: `O status do pagamento foi alterado para ${status}.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do pagamento.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Force release payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Updated payment
   */
  async forceReleasePayment(paymentId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'liberado',
          released_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: paymentId,
        entityType: 'payment',
        action: 'force_release',
      });
      
      toast({
        title: "Pagamento liberado",
        description: "O pagamento foi liberado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast({
        title: "Erro ao liberar pagamento",
        description: error.message || "Ocorreu um erro ao liberar o pagamento.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Mark payment as resolved
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Updated payment
   */
  async markPaymentAsResolved(paymentId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'pago',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logAdminAction({
        entityId: paymentId,
        entityType: 'payment',
        action: 'resolve_error',
      });
      
      toast({
        title: "Erro resolvido",
        description: "O pagamento foi marcado como resolvido.",
      });
      
      return data;
    } catch (error) {
      console.error('Error resolving payment:', error);
      toast({
        title: "Erro ao resolver pagamento",
        description: error.message || "Ocorreu um erro ao resolver o pagamento.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Get all reviews
   * @param {FilterOptions} filters - Filters for the query
   * @param {number} page - Page number
   * @param {number} pageSize - Number of reviews per page
   * @returns {Promise<PaginatedResult<any>>} List of reviews
   */
  async getReviews(filters: FilterOptions = {}, page: number = 1, pageSize: number = 10): Promise<PaginatedResult<any>> {
    try {
      const { spaceId = '', userId = '', rating = '', startDate = null, endDate = null } = filters;
      const startIndex = (page - 1) * pageSize;
  
      let query = supabase
        .from('reviews')
        .select(
          `
            *,
            user:user_id(full_name),
            space:space_id(name, owner_id, owner:owner_id(full_name))
          `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
  
      if (spaceId) {
        query = query.eq('space_id', spaceId);
      }
      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (rating) {
        query = query.eq('rating', rating);
      }
      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }
  
      const { data, error, count } = await query;
  
      if (error) throw error;
  
      return { data: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Erro ao carregar avaliações',
        description: error.message || 'Ocorreu um erro ao carregar a lista de avaliações.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  /**
   * Delete review
   * @param {string} reviewId - Review ID
   * @param {string} reason - Reason for deleting the review
   * @returns {Promise<void>}
   */
  async deleteReview(reviewId: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  
      if (error) throw error;
  
      await this.logAdminAction({
        entityId: reviewId,
        entityType: 'review',
        action: 'delete',
        details: {
          reason: reason,
        },
      });
  
      toast({
        title: 'Avaliação excluída',
        description: 'A avaliação foi excluída com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Erro ao excluir avaliação',
        description: error.message || 'Ocorreu um erro ao excluir a avaliação.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  /**
   * Get admin logs
   * @param {FilterOptions} options - Query options
   * @param {number} page - Page number
   * @param {number} pageSize - Number of logs per page
   * @returns {Promise<PaginatedResult<AuditLog>>} List of admin logs
   */
  async getAuditLogs(options: FilterOptions = {}, page: number = 1, pageSize: number = 100): Promise<PaginatedResult<AuditLog>> {
    try {
      const { sortBy = 'created_at', sortDirection = 'desc', limit = 100 } = options;
      const startIndex = (page - 1) * pageSize;
      
      const { data, error, count } = await supabase
        .from('admin_logs')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortDirection === 'asc' })
        .range(startIndex, startIndex + (limit || pageSize) - 1);
      
      if (error) throw error;
      
      return { data: data as AuditLog[] || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      toast({
        title: "Erro ao carregar logs",
        description: error.message || "Ocorreu um erro ao carregar os logs administrativos.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Export data in CSV format
   * @param {string} type - Type of data to export (users, spaces, reservations, payments)
   * @returns {Promise<Array>} Data to be exported
   */
  async exportData(type: 'users' | 'spaces' | 'reservations' | 'payments'): Promise<any[]> {
    try {
      let data = [];
      
      switch (type) {
        case 'users':
          const { data: users } = await supabase.from('profiles').select('*');
          data = users || [];
          break;
        case 'spaces':
          const { data: spaces } = await supabase
            .from('spaces')
            .select('*, owner:owner_id(full_name)');
          data = spaces || [];
          break;
        case 'reservations':
          const { data: reservations } = await supabase
            .from('reservations')
            .select('*, user:user_id(full_name), space:space_id(name)');
          data = reservations || [];
          break;
        case 'payments':
          const { data: payments } = await supabase
            .from('payments')
            .select('*, reservation:reservation_id(user_id, space_id)');
          data = payments || [];
          break;
      }
      
      await this.logAdminAction({
        entityId: '',
        entityType: 'system',
        action: `export_${type}`,
      });
      
      return data;
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast({
        title: "Erro na exportação",
        description: error.message || `Ocorreu um erro ao exportar os dados de ${type}.`,
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Log admin action
   * @param {Object} logData - Log data
   * @returns {Promise<Object>} Created log
   */
  async logAdminAction(logData: {
    entityId: string;
    entityType: string;
    action: string;
    details?: any;
  }): Promise<any> {
    try {
      const { entityId, entityType, action, details = {} } = logData;
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Get user profile to get the name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const { data, error } = await supabase
        .from('admin_logs')
        .insert({
          entity_id: entityId,
          entity_type: entityType,
          action,
          admin_id: user.id,
          admin_name: profile?.full_name || user.email,
          details
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error logging admin action:', error);
      // Don't show toast for log failures to avoid disrupting UX
      return null;
    }
  },

   /**
   * Reset user password
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resetUserPassword(userId: string, email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      await this.logAdminAction({
        entityId: userId,
        entityType: 'user',
        action: 'reset_password',
      });

      toast({
        title: 'Senha redefinida',
        description: `Um e-mail de redefinição de senha foi enviado para ${email}.`,
      });
    } catch (error) {
      console.error('Error resetting user password:', error);
      toast({
        title: 'Erro ao redefinir senha',
        description: error.message || 'Ocorreu um erro ao redefinir a senha do usuário.',
        variant: 'destructive',
      });
      throw error;
    }
  },
};
