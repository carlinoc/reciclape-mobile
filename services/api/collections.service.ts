import client from './client';

/**
 * Collections Service - Actualizado
 * Servicio para registrar colecciones de residuos con QR scanning y otorgamiento de puntos
 * 
 * @path mobile/src/services/api/collections.service.ts
 */

// ==========================================
// INTERFACES
// ==========================================

export interface CollectionItem {
  recyclingTypeId: string;
  quantity: number;
  pointsEarned: number;
}

export interface CreateCollectionRequest {
  userId: string;
  truckId?: string;
  operatorUserId?: string;
  verificationMethod: 'QR_OPERATOR' | 'QR_NEIGHBOR' | 'ADMIN';
  items: CollectionItem[];
  municipalityId: string;
  pointsAwarded?: number; // Se calcula automáticamente si no se proporciona
  scannedAt?: string; // Se asigna automáticamente si no se proporciona
}

export interface CollectionResponse {
  id: string;
  userId: string;
  operatorUserId?: string;
  truckId?: string;
  pointsAwarded: number;
  scannedAt: string;
  municipalityId: string;
  verificationMethod: string;
  items: CollectionItem[];
  createdAt: string;
}

// ==========================================
// COLLECTIONS SERVICE
// ==========================================

/**
 * 🚀 NUEVO: Crear colección con validación automática de puntos
 * Este método maneja todo el flujo de QR → Colección → Puntos
 */
export const createCollection = async (data: CreateCollectionRequest): Promise<CollectionResponse> => {
  try {
    // Calcular puntos totales si no se proporcionan
    const pointsAwarded = data.pointsAwarded || data.items.reduce((sum, item) => sum + item.pointsEarned, 0);
    
    console.log('📝 Creando colección:', {
      userId: data.userId,
      municipalityId: data.municipalityId,
      pointsAwarded: pointsAwarded,
      itemsCount: data.items.length
    });

    const payload = {
      ...data,
      pointsAwarded,
      scannedAt: data.scannedAt || new Date().toISOString()
    };

    const response = await client.post<CollectionResponse>('/collections', payload);
    
    console.log('✅ Colección creada exitosamente:', {
      id: response.data.id,
      pointsAwarded: response.data.pointsAwarded
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error creando colección:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear colección');
  }
};

/**
 * ✅ EXISTENTE: Obtener colecciones de un vecino
 */
export const getCollections = async (neighborId: string): Promise<CollectionResponse[]> => {
  try {
    const response = await client.get<CollectionResponse[]>(`/collections?neighborId=${neighborId}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo colecciones:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener colecciones');
  }
};

/**
 * ✅ EXISTENTE: Obtener colección por ID
 */
export const getCollectionById = async (collectionId: string): Promise<CollectionResponse> => {
  try {
    const response = await client.get<CollectionResponse>(`/collections/${collectionId}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo colección:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener colección');
  }
};

/**
 * 🚀 NUEVO: Crear colección simplificada para basura (caso más común)
 * Wrapper que simplifica la creación de colecciones de basura
 */
export const createGarbageCollection = async (data: {
  userId: string;
  truckId?: string;
  operatorUserId?: string;
  municipalityId: string;
  pointsToAward?: number;
}): Promise<CollectionResponse> => {
  
  const pointsToAward = data.pointsToAward || 50; // Por defecto 50 puntos por basura
  
  return createCollection({
    userId: data.userId,
    truckId: data.truckId,
    operatorUserId: data.operatorUserId,
    verificationMethod: 'QR_NEIGHBOR', // Usuario escaneó QR
    municipalityId: data.municipalityId,
    items: [
      {
        recyclingTypeId: 'basura-general', // ID genérico para basura
        quantity: 1,
        pointsEarned: pointsToAward,
      }
    ],
  });
};

/**
 * 🚀 NUEVO: Crear colección para reciclaje (para futuro)
 */
export const createRecyclingCollection = async (data: {
  userId: string;
  truckId?: string;
  operatorUserId?: string;
  municipalityId: string;
  recyclingItems: {
    type: string;
    quantity: number;
    points: number;
  }[];
}): Promise<CollectionResponse> => {
  
  const items: CollectionItem[] = data.recyclingItems.map(item => ({
    recyclingTypeId: `reciclaje-${item.type}`,
    quantity: item.quantity,
    pointsEarned: item.points,
  }));
  
  return createCollection({
    userId: data.userId,
    truckId: data.truckId,
    operatorUserId: data.operatorUserId,
    verificationMethod: 'QR_NEIGHBOR',
    municipalityId: data.municipalityId,
    items: items,
  });
};

/**
 * 🚀 NUEVO: Validar QR de operador (mock - para implementar después)
 * Esta función validaría que el QR escaneado pertenezca a un operador autorizado
 */
export const validateOperatorQR = async (qrCode: string): Promise<{
  isValid: boolean;
  operatorId?: string;
  truckId?: string;
  operatorName?: string;
}> => {
  try {
    // TODO: Implementar validación real contra el backend
    console.log('🔍 Validando QR del operador:', qrCode);
    
    // Mock validation - en producción sería una llamada al backend
    if (qrCode.startsWith('OPERATOR_') || qrCode.startsWith('TRUCK_')) {
      return {
        isValid: true,
        operatorId: 'mock-operator-id',
        truckId: 'mock-truck-id',
        operatorName: 'Juan Pérez - Recolector',
      };
    }
    
    return { isValid: false };
  } catch (error: any) {
    console.error('❌ Error validando QR:', error);
    return { isValid: false };
  }
};

/**
 * 🚀 NUEVO: Obtener estadísticas de colecciones del usuario
 */
export const getUserCollectionStats = async (userId: string): Promise<{
  totalCollections: number;
  totalPointsEarned: number;
  currentMonthCollections: number;
  currentStreak: number;
}> => {
  try {
    const collections = await getCollections(userId);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthCollections = collections.filter(c => {
      const collectionDate = new Date(c.createdAt);
      return collectionDate.getMonth() === currentMonth && 
             collectionDate.getFullYear() === currentYear;
    });
    
    const totalPointsEarned = collections.reduce((sum, c) => sum + c.pointsAwarded, 0);
    
    return {
      totalCollections: collections.length,
      totalPointsEarned,
      currentMonthCollections: currentMonthCollections.length,
      currentStreak: 0, // TODO: Calcular streak real basado en días consecutivos
    };
  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return {
      totalCollections: 0,
      totalPointsEarned: 0,
      currentMonthCollections: 0,
      currentStreak: 0,
    };
  }
};

// ==========================================
// EXPORT DEFAULT (backwards compatibility)
// ==========================================

const collectionsService = {
  createCollection,
  getCollections,
  getCollectionById,
  createGarbageCollection,
  createRecyclingCollection,
  validateOperatorQR,
  getUserCollectionStats,
};

export default collectionsService;