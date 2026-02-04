import apiClient from './client';
import { API_ENDPOINTS } from '../../src/navigation/api.config';

/**
 * Points Service
 * Servicio para gestión de puntos, balance, historial, ranking y canjes
 * 
 * @path mobile/src/services/api/points.service.ts
 */

// ==========================================
// INTERFACES
// ==========================================

export interface UserPoints {
  userId: string;
  balancePoints: number;
  lastUpdatedAt: string;
  createdAt: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  collectionId?: string;
  voucherId?: string;
  transactionType: 
    | 'EARN_GARBAGE' 
    | 'EARN_RECYCLED' 
    | 'EARN_SURVEY' 
    | 'REDEEM' 
    | 'ADJUSTMENT';
  points: number; // Positivo si gana, negativo si canjea
  createdAt: string;
  description?: string;
}

export interface PointsHistory {
  transactions: PointsTransaction[];
  totalTransactions: number;
  currentPage: number;
  totalPages: number;
  summary: {
    totalEarned: number;
    totalRedeemed: number;
    currentBalance: number;
  };
}

export interface RankingEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalPoints: number;
  collectionsCount: number;
  rank: number;
  isCurrentUser: boolean;
}

export interface ZoneRanking {
  zoneId: string;
  zoneName: string;
  rankings: RankingEntry[];
  currentUserRank?: RankingEntry;
  totalParticipants: number;
}

export interface AwardPointsRequest {
  userId: string;
  points: number;
  transactionType: 
    | 'EARN_GARBAGE' 
    | 'EARN_RECYCLED' 
    | 'EARN_SURVEY' 
    | 'ADJUSTMENT';
  collectionId?: string;
  description?: string;
}

// ==========================================
// POINTS SERVICE
// ==========================================

class PointsService {
  /**
   * Obtener balance de puntos de un usuario
   * (Usado en HomeScreen para mostrar puntaje total)
   */
  async getBalance(userId: string): Promise<UserPoints> {
    try {
      const response = await apiClient.get<UserPoints>(
        API_ENDPOINTS.POINTS.BALANCE(userId)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener balance de puntos');
    }
  }

  /**
   * Obtener historial de transacciones de puntos
   * (Usado para mostrar cómo ganó/gastó puntos)
   */
  async getHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      startDate?: string;
      endDate?: string;
      transactionType?: string;
    }
  ): Promise<PointsHistory> {
    try {
      const params: any = { page, limit };
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;
      if (filters?.transactionType) params.transactionType = filters.transactionType;

      const response = await apiClient.get<PointsHistory>(
        API_ENDPOINTS.POINTS.HISTORY(userId),
        { params }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener historial de puntos');
    }
  }

  /**
   * Obtener ranking de una zona
   * (Usado en HomeScreen para mostrar posición del usuario)
   */
  async getZoneRanking(
    zoneId: string,
    limit: number = 10,
    currentUserId?: string
  ): Promise<ZoneRanking> {
    try {
      const params: any = { limit };
      if (currentUserId) params.userId = currentUserId;

      const response = await apiClient.get<ZoneRanking>(
        API_ENDPOINTS.POINTS.RANKING(zoneId),
        { params }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener ranking');
    }
  }

  /**
   * Otorgar puntos a un usuario
   * (Usado por operadores al registrar una recolección)
   */
  async awardPoints(data: AwardPointsRequest): Promise<{
    transaction: PointsTransaction;
    newBalance: number;
  }> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.POINTS.AWARD,
        data
      );

      console.log('✅ Puntos otorgados:', response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al otorgar puntos');
    }
  }

  /**
   * Formatear puntos para mostrar en UI
   */
  formatPoints(points: number): string {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    } else {
      return points.toString();
    }
  }

  /**
   * Obtener ícono según tipo de transacción
   */
  getTransactionIcon(transactionType: PointsTransaction['transactionType']): string {
    switch (transactionType) {
      case 'EARN_GARBAGE':
        return '🗑️';
      case 'EARN_RECYCLED':
        return '♻️';
      case 'EARN_SURVEY':
        return '📋';
      case 'REDEEM':
        return '🎁';
      case 'ADJUSTMENT':
        return '⚙️';
      default:
        return '⭐';
    }
  }

  /**
   * Obtener color según tipo de transacción
   */
  getTransactionColor(transactionType: PointsTransaction['transactionType']): string {
    switch (transactionType) {
      case 'EARN_GARBAGE':
        return '#6B7280'; // Gray
      case 'EARN_RECYCLED':
        return '#22C55E'; // Green
      case 'EARN_SURVEY':
        return '#3B82F6'; // Blue
      case 'REDEEM':
        return '#EF4444'; // Red
      case 'ADJUSTMENT':
        return '#F59E0B'; // Yellow
      default:
        return '#8B5CF6'; // Purple
    }
  }

  /**
   * Obtener descripción legible del tipo de transacción
   */
  getTransactionDescription(
    transactionType: PointsTransaction['transactionType'],
    points: number
  ): string {
    switch (transactionType) {
      case 'EARN_GARBAGE':
        return 'Entrega de basura';
      case 'EARN_RECYCLED':
        return 'Reciclaje';
      case 'EARN_SURVEY':
        return 'Encuesta completada';
      case 'REDEEM':
        return 'Canje de recompensa';
      case 'ADJUSTMENT':
        return points > 0 ? 'Ajuste positivo' : 'Ajuste negativo';
      default:
        return 'Transacción';
    }
  }

  /**
   * Formatear fecha de transacción
   */
  formatTransactionDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  /**
   * Calcular nivel del usuario basado en puntos
   */
  calculateUserLevel(points: number): {
    level: number;
    levelName: string;
    nextLevelPoints: number;
    progress: number; // 0-100
  } {
    const levels = [
      { level: 1, name: 'Novato', minPoints: 0, maxPoints: 100 },
      { level: 2, name: 'Aprendiz', minPoints: 100, maxPoints: 500 },
      { level: 3, name: 'Comprometido', minPoints: 500, maxPoints: 1000 },
      { level: 4, name: 'Experto', minPoints: 1000, maxPoints: 2500 },
      { level: 5, name: 'Maestro', minPoints: 2500, maxPoints: 5000 },
      { level: 6, name: 'Leyenda', minPoints: 5000, maxPoints: Infinity },
    ];

    const currentLevel = levels.find(
      (l) => points >= l.minPoints && points < l.maxPoints
    ) || levels[levels.length - 1];

    const progress = currentLevel.maxPoints === Infinity
      ? 100
      : ((points - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100;

    return {
      level: currentLevel.level,
      levelName: currentLevel.name,
      nextLevelPoints: currentLevel.maxPoints,
      progress: Math.min(progress, 100),
    };
  }

  /**
   * Obtener medalla/badge según posición en ranking
   */
  getRankingBadge(rank: number): string {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  }
}

// ==========================================
// EXPORT SINGLETON
// ==========================================

export default new PointsService();