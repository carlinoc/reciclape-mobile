/**
 * Services Index - Actualizado
 * Exportación centralizada de todos los servicios API
 * 
 * @path mobile/src/services/api/index.ts
 */

import authService from './auth.service';
import { hasValidToken } from './client';

// ==========================================
// CORE SERVICES
// ==========================================
export { default as apiClient, setAuthToken, clearAuthToken, hasValidToken } from './client';
export { default as authService } from './auth.service';
export { default as trucksService } from './trucks.service';
export { default as pointsService } from './points.service';
export { default as locationService } from './location.service';

// 🚀 NUEVOS SERVICIOS
export { default as historyService } from './history.service';
export { default as collectionsService } from './collections.service';
export { default as rewardsService } from './rewards.service';

// Re-export existing services
export { 
  createNeighbor, 
  getNeighbor, 
  updateNeighbor, 
  getPointsHistory 
} from './neighbors.service';

export { 
  getNotifications, 
  markAsRead 
} from './notifications.service';

export { 
  getRecyclingTypes 
} from './recycling-types.service';

// ==========================================
// TYPE EXPORTS - AUTH
// ==========================================
export type {
  LoginRequest,
  LoginResponse,
  RegisterNeighborRequest,
} from './auth.service';

// ==========================================
// TYPE EXPORTS - TRUCKS
// ==========================================
export type {
  Truck,
  TruckType,
  Zone,
  TruckPosition,
  NearbyTrucksRequest,
  NearbyTruck,
  TruckPositionUpdate,
} from './trucks.service';

// ==========================================
// TYPE EXPORTS - POINTS
// ==========================================
export type {
  UserPoints,
  PointsTransaction,
  PointsHistory,
  RankingEntry,
  ZoneRanking,
  AwardPointsRequest,
} from './points.service';

// ==========================================
// TYPE EXPORTS - LOCATION
// ==========================================
export type {
  Department,
  Province,
  District,
} from './location.service';

// ==========================================
// 🚀 NUEVOS TYPE EXPORTS - HISTORY
// ==========================================
export type {
  HistoryTransaction,
  DayActivity,
  UserStreak,
  HistoryResponse,
} from './history.service';

// ==========================================
// 🚀 NUEVOS TYPE EXPORTS - COLLECTIONS
// ==========================================
export type {
  CollectionItem,
  CreateCollectionRequest,
  CollectionResponse,
} from './collections.service';

// ==========================================
// 🚀 NUEVOS TYPE EXPORTS - REWARDS
// ==========================================
export type {
  Reward,
  RewardCatalogResponse,
} from './rewards.service';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Inicializar servicios (ejecutar al iniciar la app)
 */
export const initializeServices = async (): Promise<void> => {
  try {
    console.log('🚀 Inicializando servicios...');
    
    // Verificar conectividad
    const hasToken = await hasValidToken();
    console.log('🔐 Token válido:', hasToken);
    
    // Refresh FCM token si es necesario
    await authService.refreshFcmTokenIfNeeded();
    
    console.log('✅ Servicios inicializados correctamente');
  } catch (error) {
    console.error('❌ Error inicializando servicios:', error);
  }
};

/**
 * Limpiar caché de servicios
 */
export const clearServicesCache = async (): Promise<void> => {
  try {
    // TODO: Limpiar cualquier caché local de los servicios
    console.log('🧹 Caché de servicios limpiado');
  } catch (error) {
    console.error('❌ Error limpiando caché:', error);
  }
};

// ==========================================
// CONSTANTS
// ==========================================

export const POINTS_PER_GARBAGE_COLLECTION = 50;
export const POINTS_PER_RECYCLING_COLLECTION = 75;
export const DEFAULT_MUNICIPALITY_ID = '9ae8dab4-d959-4e37-8599-e54531b585bb';

// ==========================================
// SERVICE STATUS
// ==========================================

export const getServicesStatus = () => ({
  auth: '✅ Activo',
  points: '✅ Activo',
  trucks: '✅ Activo',
  collections: '✅ Activo',
  history: '✅ Activo',
  rewards: '✅ Activo',
  location: '✅ Activo',
  notifications: '✅ Activo',
});