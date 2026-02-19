/**
 * API Configuration
 * Configuración centralizada de endpoints y parámetros de la API
 * 
 * @path mobile/src/config/api.config.ts
 */

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

// URL base de la API (desarrollo local)
//export const API_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = 'http://192.168.1.18:3000';

// URL base de la API (producción)
//export const API_BASE_URL = 'https://reciclape.onrender.com';

// WebSocket URL
export const WS_URL = API_BASE_URL.replace('https', 'wss').replace('http', 'ws');

// Mapbox
// export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';
export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// ==========================================
// API ENDPOINTS
// ==========================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    VERIFY_PHONE: '/auth/verify-phone',
    SEND_OTP: '/auth/send-otp',
    PROFILE: '/auth/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    POINTS: (id: string) => `/users/${id}/points`,
    PREFERENCES: (id: string) => `/users/${id}/preferences`,
  },

  // Trucks
  TRUCKS: {
    BASE: '/trucks',
    BY_ID: (id: string) => `/trucks/${id}`,
    POSITIONS: (id: string) => `/trucks/${id}/positions`,
    NEARBY: '/trucks/nearby',
    BY_ZONE: (zoneId: string) => `/trucks/zone/${zoneId}`,
  },

  // Collections
  COLLECTIONS: {
    BASE: '/collections',
    BY_ID: (id: string) => `/collections/${id}`,
    SCAN_QR: '/collections/scan-qr',
    BY_USER: (userId: string) => `/collections/user/${userId}`,
  },

  // Points
  POINTS: {
    BALANCE: (userId: string) => `/points/balance/${userId}`,
    HISTORY: (userId: string) => `/points/history/${userId}`,
    RANKING: (zoneId: string) => `/points/ranking/${zoneId}`,
    AWARD: '/points/award',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_USER: (userId: string) => `/notifications/${userId}`,
    SEND_PUSH: '/notifications/send-push',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },

  // Zones
  ZONES: {
    BASE: '/zones',
    BY_ID: (id: string) => `/zones/${id}`,
  },

  // Addresses
  ADDRESSES: {
    BASE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },
};

// ==========================================
// REQUEST CONFIGURATION
// ==========================================

export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// ==========================================
// WEBSOCKET EVENTS
// ==========================================

export const WS_EVENTS = {
  // Conexión
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Trucks
  TRUCK_POSITION_UPDATE: 'truck:position:update',
  TRUCK_STATUS_CHANGE: 'truck:status:change',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Points
  POINTS_AWARDED: 'points:awarded',
  POINTS_UPDATED: 'points:updated',

  // Geofence
  GEOFENCE_ENTERED: 'geofence:entered',
  GEOFENCE_EXITED: 'geofence:exited',
};

// ==========================================
// STORAGE KEYS
// ==========================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  ONBOARDING_COMPLETED: 'hasCompletedOnboarding',
  PREFERENCES: 'userPreferences',
  FCM_TOKEN: 'fcmToken',
};

// ==========================================
// DEFAULT VALUES
// ==========================================

export const DEFAULT_VALUES = {
  ALERT_TIME: 5, // minutos
  GARBAGE_ENABLED: true,
  RECYCLING_ENABLED: false,
  NOTIFICATIONS_ENABLED: true,
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WS_URL: WS_URL,
  MAPBOX_TOKEN: MAPBOX_ACCESS_TOKEN,
  TIMEOUT: REQUEST_CONFIG.TIMEOUT,
  ENDPOINTS: API_ENDPOINTS,
};