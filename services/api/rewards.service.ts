import client from './client';

/**
 * Rewards Service
 * Servicio para gestión del catálogo de recompensas y canjes
 * 
 * @path mobile/src/services/api/rewards.service.ts
 */

// ==========================================
// INTERFACES
// ==========================================

export interface Reward {
  id: string;
  municipalityId: string;
  name: string;
  description: string;
  rewardType: 'POINTS' | 'DISCOUNT' | 'COUPON' | 'CASHBACK' | 'EVENT_TICKET';
  pointsRequired: number;
  stock: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  isArchived: boolean;
  archivedAt?: string;
}

export interface RewardCatalogResponse {
  rewards: Reward[];
  totalRewards: number;
}

// ==========================================
// REWARDS SERVICE
// ==========================================

class RewardsService {
  /**
   * Obtener catálogo de recompensas de una municipalidad
   * Usa el endpoint: GET /rewards-catalog?municipalityId={id}&isArchived=false
   */
  async getRewardsCatalog(
    municipalityId: string,
    filters?: {
      isActive?: boolean;
      isArchived?: boolean;
      rewardType?: string;
    }
  ): Promise<Reward[]> {
    try {
      console.log('🎁 Obteniendo catálogo de recompensas para municipio:', municipalityId);
      
      const params: any = { municipalityId };
      
      // Aplicar filtros
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;
      if (filters?.isArchived !== undefined) params.isArchived = filters.isArchived;
      if (filters?.rewardType) params.rewardType = filters.rewardType;
      
      // Por defecto, no mostrar archivadas
      if (params.isArchived === undefined) params.isArchived = false;

      const response = await client.get('/rewards-catalog', { params });
      
      console.log('✅ Recompensas obtenidas:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo catálogo de recompensas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener recompensas');
    }
  }

  /**
   * Crear nueva recompensa (solo para admins)
   */
  async createReward(rewardData: Omit<Reward, 'id' | 'createdAt' | 'isArchived' | 'archivedAt'>): Promise<Reward> {
    try {
      console.log('📝 Creando nueva recompensa:', rewardData.name);
      
      const response = await client.post<Reward>('/rewards-catalog', rewardData);
      
      console.log('✅ Recompensa creada:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando recompensa:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear recompensa');
    }
  }

  /**
   * Obtener recompensa por ID
   */
  async getRewardById(rewardId: string): Promise<Reward> {
    try {
      const response = await client.get<Reward>(`/rewards-catalog/${rewardId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo recompensa:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener recompensa');
    }
  }

  /**
   * Actualizar recompensa
   */
  async updateReward(rewardId: string, updates: Partial<Reward>): Promise<Reward> {
    try {
      const response = await client.patch<Reward>(`/rewards-catalog/${rewardId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando recompensa:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar recompensa');
    }
  }

  /**
   * Obtener recompensas disponibles para el usuario (filtradas por puntos)
   */
  async getAvailableRewards(municipalityId: string, userPoints: number): Promise<{
    affordable: Reward[];
    upcoming: Reward[];
  }> {
    try {
      const allRewards = await this.getRewardsCatalog(municipalityId, { 
        isActive: true, 
        isArchived: false 
      });
      
      const affordable = allRewards.filter(r => 
        r.pointsRequired <= userPoints && 
        r.stock > 0 &&
        new Date(r.startDate) <= new Date() &&
        new Date(r.endDate) >= new Date()
      );
      
      const upcoming = allRewards.filter(r => 
        r.pointsRequired > userPoints && 
        r.pointsRequired <= userPoints + 500 // Próximas a alcanzar
      ).sort((a, b) => a.pointsRequired - b.pointsRequired);
      
      return { affordable, upcoming };
    } catch (error: any) {
      console.error('❌ Error obteniendo recompensas disponibles:', error);
      return { affordable: [], upcoming: [] };
    }
  }

  /**
   * Obtener la próxima recompensa más cercana
   */
  async getNextReward(municipalityId: string, userPoints: number): Promise<Reward | null> {
    try {
      const { upcoming } = await this.getAvailableRewards(municipalityId, userPoints);
      return upcoming.length > 0 ? upcoming[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Formatear tipo de recompensa para mostrar al usuario
   */
  formatRewardType(rewardType: string): string {
    switch (rewardType) {
      case 'POINTS':
        return 'Puntos';
      case 'DISCOUNT':
        return 'Descuento';
      case 'COUPON':
        return 'Cupón';
      case 'CASHBACK':
        return 'Reembolso';
      case 'EVENT_TICKET':
        return 'Entrada';
      default:
        return 'Recompensa';
    }
  }

  /**
   * Obtener ícono según tipo de recompensa
   */
  getRewardIcon(rewardType: string): string {
    switch (rewardType) {
      case 'POINTS':
        return '⭐';
      case 'DISCOUNT':
        return '💰';
      case 'COUPON':
        return '🎫';
      case 'CASHBACK':
        return '💵';
      case 'EVENT_TICKET':
        return '🎟️';
      default:
        return '🎁';
    }
  }

  /**
   * Verificar si una recompensa está disponible
   */
  isRewardAvailable(reward: Reward, userPoints: number): boolean {
    const now = new Date();
    const startDate = new Date(reward.startDate);
    const endDate = new Date(reward.endDate);
    
    return (
      reward.isActive &&
      !reward.isArchived &&
      reward.stock > 0 &&
      reward.pointsRequired <= userPoints &&
      now >= startDate &&
      now <= endDate
    );
  }

  /**
   * Calcular días restantes para una recompensa
   */
  getDaysUntilExpiry(reward: Reward): number {
    const now = new Date();
    const endDate = new Date(reward.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Generar texto descriptivo para mostrar al usuario
   */
  getRewardDescription(reward: Reward, userPoints: number): {
    canAfford: boolean;
    missingPoints: number;
    statusText: string;
    urgencyLevel: 'low' | 'medium' | 'high';
  } {
    const canAfford = this.isRewardAvailable(reward, userPoints);
    const missingPoints = Math.max(0, reward.pointsRequired - userPoints);
    const daysLeft = this.getDaysUntilExpiry(reward);
    
    let statusText = '';
    let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (canAfford) {
      if (reward.stock <= 3) {
        statusText = `¡Solo quedan ${reward.stock}!`;
        urgencyLevel = 'high';
      } else if (daysLeft <= 7) {
        statusText = `Válido por ${daysLeft} días más`;
        urgencyLevel = 'medium';
      } else {
        statusText = '¡Ya puedes canjearlo!';
        urgencyLevel = 'low';
      }
    } else {
      if (missingPoints <= 100) {
        statusText = `Te faltan ${missingPoints} puntos`;
        urgencyLevel = 'medium';
      } else {
        statusText = `Necesitas ${missingPoints} puntos más`;
        urgencyLevel = 'low';
      }
    }
    
    return { canAfford, missingPoints, statusText, urgencyLevel };
  }

  /**
   * Buscar recompensas por nombre
   */
  async searchRewards(municipalityId: string, searchTerm: string): Promise<Reward[]> {
    try {
      const allRewards = await this.getRewardsCatalog(municipalityId);
      
      return allRewards.filter(reward => 
        reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      return [];
    }
  }
}

// ==========================================
// EXPORT SINGLETON
// ==========================================

export default new RewardsService();