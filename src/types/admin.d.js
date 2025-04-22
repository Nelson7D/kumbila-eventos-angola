
// Types converted to JSDoc comments for better IDE support
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
 * @typedef {Object} DateRange
 * @property {Date|undefined} from - Start date
 * @property {Date} [to] - End date (optional)
 */

/**
 * @callback SelectRangeEventHandler
 * @param {DateRange} range - Date range object
 * @returns {void}
 */
