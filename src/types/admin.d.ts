
/**
 * @typedef {Object} AdminDashboardStats
 * @property {number} totalUsers - Total number of users
 * @property {number} totalSpaces - Total number of spaces
 * @property {number} totalReservations - Total number of reservations
 * @property {number} totalPayments - Total number of payments
 * @property {number} totalRevenue - Total revenue
 * @property {number} activeReservations - Number of active reservations
 * @property {number} pendingSpaces - Number of pending spaces
 * @property {number} completionRate - Reservation completion rate
 * @property {Array<{month: string, reservations: number, revenue: number}>} monthlyStats - Monthly statistics
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} full_name - User full name
 * @property {string|null} avatar_url - User avatar URL
 * @property {string} user_role - User role (admin, user, etc)
 * @property {string} created_at - User creation date
 * @property {string} [last_sign_in] - Last sign in date
 * @property {('active'|'inactive'|'suspended')} status - User status
 */

/**
 * @typedef {Object} AdminSpace
 * @property {string} id - Space ID
 * @property {string} name - Space name
 * @property {string} location - Space location
 * @property {string} type - Space type
 * @property {Object} owner - Space owner
 * @property {string} owner.id - Owner ID
 * @property {string} owner.full_name - Owner full name
 * @property {('active'|'pending'|'blocked')} status - Space status
 * @property {string} created_at - Space creation date
 * @property {number} price_per_day - Price per day
 */

/**
 * @typedef {Object} DateRange
 * @property {Date|undefined} from - Start date
 * @property {Date} [to] - End date (optional)
 */

/**
 * @callback SelectRangeEventHandler
 * @param {DateRange} range - Date range object
 * @returns {void}
 */

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

export interface DateRange {
  from: Date | undefined;
  to?: Date;
}

export interface FilterOptions {
  status?: string;
  spaceId?: string;
  userId?: string;
  type?: string;
  location?: string;
  owner?: string;
  method?: string;
  rating?: string;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  searchTerm?: string;
}

export interface AuditLog {
  id: string;
  entity_id: string;
  entity_type: string;
  action: string;
  admin_id: string;
  admin_name: string;
  created_at: string;
  details?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
