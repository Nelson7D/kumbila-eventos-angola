import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  user_role: string;
  status: string;
  created_at: string;
  last_sign_in: string | null;
}

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
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
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
   * @returns {Promise<Object>} Object with users and total count
   */
  async getUsers(search: string = '', page: number = 1, pageSize: number = 10) {
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
  
      return { users, total };
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
  async updateUserStatus(userId, status) {
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
  async deleteUser(userId) {
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
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of admin spaces
   */
  async getSpaces(options = {}) {
    try {
      const { searchTerm = '', status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      
      let query = supabase
        .from('spaces')
        .select(`
          *,
          owner:owner_id(id, full_name)
        `)
        .ilike('name', `%${searchTerm}%`)
        .order(sortBy, { ascending: sortDirection === 'asc' });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
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
  async updateSpaceStatus(spaceId, status) {
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
  async deleteSpace(spaceId) {
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
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of reservations
   */
  async getReservations(options = {}) {
    try {
      const { status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      
      let query = supabase
        .from('reservations')
        .select(`
          *,
          space:space_id(id, name),
          user:user_id(id, full_name)
        `)
        .order(sortBy, { ascending: sortDirection === 'asc' });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
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
   * Update reservation status
   * @param {string} reservationId - Reservation ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated reservation
   */
  async updateReservationStatus(reservationId, status) {
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
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of payments
   */
  async getPayments(options = {}) {
    try {
      const { status = null, sortBy = 'created_at', sortDirection = 'desc' } = options;
      
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
        `)
        .order(sortBy, { ascending: sortDirection === 'asc' });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
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
  async updatePaymentStatus(paymentId, status) {
    try {
      const updates = { status };
      
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
   * Get all reviews
    * @param {Object} filters - Filters for the query
   * @param {number} page - Page number
   * @param {number} pageSize - Number of reviews per page
   * @returns {Promise<Object>} List of reviews
   */
  async getReviews(filters: any = {}, page: number = 1, pageSize: number = 10) {
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
  
      const reviews = data || [];
      const total = count || 0;
  
      return { reviews, total };
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
  async deleteReview(reviewId: string, reason: string) {
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
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of admin logs
   */
  async getLogs(options = {}) {
    try {
      const { sortBy = 'created_at', sortDirection = 'desc', limit = 100 } = options;
      
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
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
   * Log admin action
   * @param {Object} logData - Log data
   * @returns {Promise<Object>} Created log
   */
  async logAdminAction(logData) {
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
          admin_name: profile.full_name || user.email,
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
    async resetUserPassword(userId: string, email: string) {
      try {
        const { error } = await supabase.auth.admin.resetPassword(userId);
  
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
