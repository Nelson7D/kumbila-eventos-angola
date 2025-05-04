
import { createClient } from '@supabase/supabase-js';
import { 
  AdminDashboardStats, 
  AdminUser, 
  AdminSpace, 
  FilterOptions, 
  AuditLog, 
  PaginatedResult 
} from '@/types/admin';

// Use environment variables to configure Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin service for handling admin operations
 */
class AdminService {
  /**
   * Check if the current user has admin access
   * @returns {Promise<boolean>} True if user has admin access
   */
  async checkAdminAccess(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      
      if (error || !roles || roles.length === 0) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }
  
  /**
   * Get dashboard statistics
   * @returns {Promise<AdminDashboardStats>} Dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get total spaces
      const { count: totalSpaces } = await supabase
        .from('spaces')
        .select('*', { count: 'exact', head: true });
      
      // Get pending spaces
      const { count: pendingSpaces } = await supabase
        .from('spaces')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get total reservations
      const { count: totalReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      
      // Get active reservations
      const { count: activeReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .in('status', ['confirmada', 'em_andamento']);
      
      // Get total payments
      const { count: totalPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true });
      
      // Get total revenue
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pago');
      
      const totalRevenue = revenueData?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
      
      // Get completion rate
      const { count: completedReservations } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'finalizada');
      
      const completionRate = totalReservations > 0 ? (completedReservations / totalReservations) * 100 : 0;
      
      // Get monthly stats for the last 12 months
      const monthlyStats = [];
      const today = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
        
        const startDate = month.toISOString().split('T')[0];
        const endDate = nextMonth.toISOString().split('T')[0];
        
        const { count: reservations } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate)
          .lte('created_at', endDate);
        
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'pago')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
        
        const revenue = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
        
        monthlyStats.push({
          month: month.toLocaleString('default', { month: 'short' }),
          reservations,
          revenue
        });
      }
      
      return {
        totalUsers: totalUsers || 0,
        totalSpaces: totalSpaces || 0,
        totalReservations: totalReservations || 0,
        totalPayments: totalPayments || 0,
        totalRevenue,
        activeReservations: activeReservations || 0,
        pendingSpaces: pendingSpaces || 0,
        completionRate,
        monthlyStats
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalUsers: 0,
        totalSpaces: 0,
        totalReservations: 0,
        totalPayments: 0,
        totalRevenue: 0,
        activeReservations: 0,
        pendingSpaces: 0,
        completionRate: 0,
        monthlyStats: []
      };
    }
  }
  
  /**
   * Get users with pagination
   * @param {string} searchTerm Search term for filtering users
   * @param {number} page Page number
   * @param {number} pageSize Number of users per page
   * @returns {Promise<{users: AdminUser[], total: number}>} Users and total count
   */
  async getUsers(searchTerm = '', page = 1, pageSize = 10): Promise<PaginatedResult<AdminUser>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          status,
          created_at,
          auth.users!inner(email, last_sign_in_at),
          user_roles(role)
        `, { count: 'exact' })
        .range(offset, offset + pageSize - 1);
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,auth.users.email.ilike.%${searchTerm}%`);
      }
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const formattedUsers: AdminUser[] = data.map(profile => {
        const user = profile.users;
        const roles = profile.user_roles || [];
        const userRole = roles.length > 0 ? roles[0].role : 'user';
        
        return {
          id: profile.id,
          email: user?.email || '',
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          user_role: userRole,
          status: profile.status || 'active',
          created_at: profile.created_at,
          last_sign_in: user?.last_sign_in_at
        };
      });
      
      return {
        data: formattedUsers,
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading users:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Get spaces with pagination and filtering
   * @param {FilterOptions} filters Filters for spaces
   * @param {number} page Page number
   * @param {number} pageSize Number of spaces per page
   * @returns {Promise<{spaces: AdminSpace[], total: number}>} Spaces and total count
   */
  async getSpaces(filters: FilterOptions = {}, page = 1, pageSize = 10): Promise<PaginatedResult<AdminSpace>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('spaces')
        .select(`
          id,
          name,
          type,
          location,
          status,
          created_at,
          price_per_day,
          profiles!inner(id, full_name)
        `, { count: 'exact' });
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.owner) {
        query = query.ilike('profiles.full_name', `%${filters.owner}%`);
      }
      
      // Apply sorting if provided
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'asc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const formattedSpaces: AdminSpace[] = data.map(space => ({
        id: space.id,
        name: space.name,
        type: space.type,
        location: space.location,
        status: space.status,
        created_at: space.created_at,
        price_per_day: space.price_per_day,
        owner: {
          id: space.profiles.id,
          full_name: space.profiles.full_name
        }
      }));
      
      return {
        data: formattedSpaces,
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading spaces:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Get reservations with pagination and filtering
   * @param {FilterOptions} filters Filters for reservations
   * @param {number} page Page number
   * @param {number} pageSize Number of reservations per page
   * @returns {Promise<{data: any[], total: number}>} Reservations and total count
   */
  async getReservations(filters: FilterOptions = {}, page = 1, pageSize = 10): Promise<PaginatedResult<any>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('reservations')
        .select(`
          *,
          space:spaces(id, name, owner_id),
          user:profiles(id, full_name)
        `, { count: 'exact' });
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.spaceId) {
        query = query.eq('space_id', filters.spaceId);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.startDate) {
        query = query.gte('start_datetime', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('end_datetime', filters.endDate);
      }
      
      // Apply sorting if provided
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'asc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading reservations:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Get payments with pagination and filtering
   * @param {FilterOptions} filters Filters for payments
   * @param {number} page Page number
   * @param {number} pageSize Number of payments per page
   * @returns {Promise<{data: any[], total: number}>} Payments and total count
   */
  async getPayments(filters: FilterOptions = {}, page = 1, pageSize = 10): Promise<PaginatedResult<any>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('payments')
        .select(`
          *,
          reservation:reservations(
            id,
            user:profiles(id, full_name),
            space:spaces(id, name)
          )
        `, { count: 'exact' });
      
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
      
      // Apply sorting if provided
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'asc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading payments:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Get reviews with pagination and filtering
   * @param {FilterOptions} filters Filters for reviews
   * @param {number} page Page number
   * @param {number} pageSize Number of reviews per page
   * @returns {Promise<{data: any[], total: number}>} Reviews and total count
   */
  async getReviews(filters: FilterOptions = {}, page = 1, pageSize = 10): Promise<PaginatedResult<any>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(id, full_name),
          space:spaces(id, name)
        `, { count: 'exact' });
      
      if (filters.spaceId) {
        query = query.eq('space_id', filters.spaceId);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.rating) {
        query = query.eq('rating', parseInt(filters.rating));
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      // Apply sorting if provided
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'asc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading reviews:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Get audit logs with pagination and filtering
   * @param {FilterOptions} filters Filters for audit logs
   * @param {number} page Page number
   * @param {number} pageSize Number of logs per page
   * @returns {Promise<{data: AuditLog[], total: number}>} Audit logs and total count
   */
  async getAuditLogs(filters: FilterOptions = {}, page = 1, pageSize = 15): Promise<PaginatedResult<AuditLog>> {
    try {
      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('admin_logs')
        .select('*', { count: 'exact' });
      
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.action) {
        query = query.ilike('action', `%${filters.action}%`);
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
      
      // Apply sorting
      if (filters.sortBy) {
        const direction = filters.sortDirection || 'asc';
        query = query.order(filters.sortBy, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      const limit = filters.limit || pageSize;
      query = query.range(offset, offset + limit - 1);
      
      const { data, count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error loading audit logs:', error);
      return {
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * Update user status
   * @param {string} userId User ID
   * @param {string} status New status
   * @returns {Promise<void>}
   */
  async updateUserStatus(userId: string, status: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      // Log the action
      await this.logAdminAction('user', userId, `update_status_${status}`, {
        previous_status: 'unknown', // Ideally fetch previous status
        new_status: status
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
  
  /**
   * Reset user password
   * @param {string} userId User ID
   * @param {string} email User email
   * @returns {Promise<void>}
   */
  async resetUserPassword(userId: string, email: string): Promise<void> {
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      // Log the action
      await this.logAdminAction('user', userId, 'reset_password', {
        email
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
  
  /**
   * Update space status
   * @param {string} spaceId Space ID
   * @param {string} status New status
   * @returns {Promise<void>}
   */
  async updateSpaceStatus(spaceId: string, status: string): Promise<void> {
    try {
      await supabase
        .from('spaces')
        .update({ status })
        .eq('id', spaceId);
      
      // Log the action
      await this.logAdminAction('space', spaceId, `update_status_${status}`, {
        previous_status: 'unknown', // Ideally fetch previous status
        new_status: status
      });
    } catch (error) {
      console.error('Error updating space status:', error);
      throw error;
    }
  }
  
  /**
   * Cancel reservation
   * @param {string} reservationId Reservation ID
   * @param {string} reason Cancellation reason
   * @returns {Promise<void>}
   */
  async cancelReservation(reservationId: string, reason: string): Promise<void> {
    try {
      // Update reservation status
      await supabase
        .from('reservations')
        .update({ status: 'cancelada' })
        .eq('id', reservationId);
      
      // Log the action
      await this.logAdminAction('reservation', reservationId, 'cancel', {
        reason
      });
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }
  
  /**
   * Delete review
   * @param {string} reviewId Review ID
   * @param {string} reason Deletion reason
   * @returns {Promise<void>}
   */
  async deleteReview(reviewId: string, reason: string): Promise<void> {
    try {
      // Get review details before deletion for logging
      const { data: review } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', reviewId)
        .single();
      
      // Delete the review
      await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      // Log the action
      await this.logAdminAction('review', reviewId, 'delete', {
        review,
        reason
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
  
  /**
   * Force release payment
   * @param {string} paymentId Payment ID
   * @returns {Promise<void>}
   */
  async forceReleasePayment(paymentId: string): Promise<void> {
    try {
      await supabase
        .from('payments')
        .update({ 
          status: 'liberado', 
          released_at: new Date().toISOString() 
        })
        .eq('id', paymentId);
      
      // Log the action
      await this.logAdminAction('payment', paymentId, 'force_release', {});
    } catch (error) {
      console.error('Error releasing payment:', error);
      throw error;
    }
  }
  
  /**
   * Mark payment as resolved
   * @param {string} paymentId Payment ID
   * @returns {Promise<void>}
   */
  async markPaymentAsResolved(paymentId: string): Promise<void> {
    try {
      await supabase
        .from('payments')
        .update({ status: 'pago' })
        .eq('id', paymentId)
        .eq('status', 'erro');
      
      // Log the action
      await this.logAdminAction('payment', paymentId, 'resolve_error', {});
    } catch (error) {
      console.error('Error resolving payment:', error);
      throw error;
    }
  }
  
  /**
   * Export data
   * @param {string} type Type of data to export
   * @returns {Promise<any>} Exported data
   */
  async exportData(type: string): Promise<any> {
    try {
      let data;
      
      switch (type) {
        case 'users':
          const { data: users } = await supabase.from('profiles').select('*');
          data = users;
          break;
        case 'spaces':
          const { data: spaces } = await supabase.from('spaces').select('*');
          data = spaces;
          break;
        case 'reservations':
          const { data: reservations } = await supabase.from('reservations').select('*');
          data = reservations;
          break;
        default:
          throw new Error('Invalid export type');
      }
      
      // Log the action
      await this.logAdminAction('system', 'export', `export_${type}`, {
        count: data?.length || 0
      });
      
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
  
  /**
   * Log admin action
   * @param {string} entityType Type of entity
   * @param {string} entityId Entity ID
   * @param {string} action Action performed
   * @param {Object} details Additional details
   * @returns {Promise<void>}
   */
  private async logAdminAction(
    entityType: string,
    entityId: string,
    action: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Get user details
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      await supabase.from('admin_logs').insert({
        entity_type: entityType,
        entity_id: entityId,
        action,
        admin_id: user.id,
        admin_name: profile?.full_name || user.email,
        details
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }
}

export const adminService = new AdminService();
