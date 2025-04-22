import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {string|null} avatar_url
 * @property {string} user_role
 * @property {string} created_at
 * @property {string} last_sign_in
 * @property {('active'|'inactive'|'suspended')} status
 */

export const adminService = {
  /**
   * Checks if the current user has admin access
   * @returns {Promise<boolean>}
   */
  async checkAdminAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error || !data) return false;
      
      return data.role === 'admin';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  },
  
  /**
   * Gets dashboard statistics
   * @returns {Promise<Object>}
   */
  async getDashboardStats() {
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) throw error;
      
      return data || {
        total_users: 0,
        total_spaces: 0,
        total_reservations: 0,
        total_revenue: 0,
        pending_reviews: 0,
        pending_verifications: 0,
        active_disputes: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas do painel.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  /**
   * Gets all users with their roles and status
   * @returns {Promise<Array<AdminUser>>}
   */
  async getUsers() {
    try {
      // Get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Get auth users
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
      
      if (authUsersError) throw authUsersError;
      
      // Get user roles
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (userRolesError) throw userRolesError;
      
      // Match profiles with auth users and user roles
      const users = (profilesData || []).map(profile => {
        // Find corresponding auth user for email - ensure we have a valid profile
        const profileId = profile ? profile.id || '' : '';
        
        // Make sure authUsersData is defined before searching through it
        const authUser = authUsersData && authUsersData.users 
          ? authUsersData.users.find(au => au && au.id === profileId) 
          : null;
        
        // Find user role
        const userRole = (userRolesData || []).find(ur => ur && ur.user_id === profileId);
        const role = userRole && userRole.role ? userRole.role : 'user';
        
        return {
          id: profileId,
          email: authUser && authUser.email ? authUser.email : '',
          full_name: profile && profile.full_name ? profile.full_name : '',
          avatar_url: profile ? profile.avatar_url : null,
          user_role: role,
          created_at: profile && profile.created_at ? profile.created_at : '',
          last_sign_in: authUser && authUser.last_sign_in_at ? authUser.last_sign_in_at : '',
          status: profile && profile.status ? profile.status : 'active'
        };
      });
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Updates a user's role
   * @param {string} userId - ID of the user to update
   * @param {string} role - New role for the user
   * @returns {Promise<void>}
   */
  async updateUserRole(userId, role) {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: role }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Função do usuário atualizada",
        description: "A função do usuário foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro ao atualizar função do usuário",
        description: "Não foi possível atualizar a função do usuário. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Updates a user's status
   * @param {string} userId - ID of the user to update
   * @param {('active'|'inactive'|'suspended')} status - New status for the user
   * @returns {Promise<void>}
   */
  async updateUserStatus(userId, status) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: status })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Status do usuário atualizado",
        description: "O status do usuário foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erro ao atualizar status do usuário",
        description: "Não foi possível atualizar o status do usuário. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets all spaces
   * @returns {Promise<Array<Object>>}
   */
  async getSpaces() {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching spaces:', error);
      toast({
        title: "Erro ao carregar espaços",
        description: "Não foi possível carregar a lista de espaços.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Updates a space's verification status
   * @param {string} spaceId - ID of the space to update
   * @param {boolean} isVerified - New verification status for the space
   * @returns {Promise<void>}
   */
  async updateSpaceVerification(spaceId, isVerified) {
    try {
      const { error } = await supabase
        .from('spaces')
        .update({ is_verified: isVerified })
        .eq('id', spaceId);

      if (error) throw error;

      toast({
        title: "Status de verificação do espaço atualizado",
        description: "O status de verificação do espaço foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating space verification:', error);
      toast({
        title: "Erro ao atualizar status de verificação do espaço",
        description: "Não foi possível atualizar o status de verificação do espaço. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets all reservations
   * @returns {Promise<Array<Object>>}
   */
  async getReservations() {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          user:user_id (full_name, email),
          space:space_id (name)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Erro ao carregar reservas",
        description: "Não foi possível carregar a lista de reservas.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Updates a reservation's status
   * @param {string} reservationId - ID of the reservation to update
   * @param {string} status - New status for the reservation
   * @returns {Promise<void>}
   */
  async updateReservationStatus(reservationId, status) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: status })
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: "Status da reserva atualizado",
        description: "O status da reserva foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erro ao atualizar status da reserva",
        description: "Não foi possível atualizar o status da reserva. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets all payments
   * @returns {Promise<Array<Object>>}
   */
  async getPayments() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          reservation:reservation_id (id)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar a lista de pagamentos.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Updates a payment's status
   * @param {string} paymentId - ID of the payment to update
   * @param {string} status - New status for the payment
   * @returns {Promise<void>}
   */
  async updatePaymentStatus(paymentId, status) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: status })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Status do pagamento atualizado",
        description: "O status do pagamento foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Erro ao atualizar status do pagamento",
        description: "Não foi possível atualizar o status do pagamento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets all reviews
   * @returns {Promise<Array<Object>>}
   */
  async getReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id (full_name, email),
          space:space_id (name)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Erro ao carregar avaliações",
        description: "Não foi possível carregar a lista de avaliações.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Deletes a review
   * @param {string} reviewId - ID of the review to delete
   * @returns {Promise<void>}
   */
  async deleteReview(reviewId) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Avaliação excluída",
        description: "A avaliação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Erro ao excluir avaliação",
        description: "Não foi possível excluir a avaliação. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  },

  /**
   * Gets all audit logs
   * @returns {Promise<Array<Object>>}
   */
  async getAuditLogs() {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          user:user_id (full_name, email)
        `);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Erro ao carregar logs de auditoria",
        description: "Não foi possível carregar os logs de auditoria.",
        variant: "destructive",
      });
      throw error;
    }
  }
};
