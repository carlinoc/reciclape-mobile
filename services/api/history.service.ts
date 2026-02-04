import client from './client';

import AsyncStorage from '@react-native-async-storage/async-storage';



/**

 * History Service

 * Servicio para gestión del historial de actividades del usuario

 * Incluye: colecciones, puntos, streaks, días saltados

 *

 * @path mobile/src/services/api/history.service.ts

 */



// ==========================================

// INTERFACES

// ==========================================



export interface HistoryTransaction {

  id: string;

  userId: string;

  collectionId?: string;

  voucherId?: string;

  transactionType: 'EARN_GARBAGE' | 'EARN_RECYCLED' | 'EARN_SURVEY' | 'REDEEM' | 'ADJUSTMENT';

  points: number;

  createdAt: string;

  description?: string;

  // Campos adicionales para mostrar en historial

  activityType: 'basura' | 'reciclaje' | 'encuesta' | 'canje';

  status: 'entregado' | 'saltado' | 'completado';

}



export interface DayActivity {

  date: string; // YYYY-MM-DD

  hasActivity: boolean;

  activityType?: 'basura' | 'reciclaje';

  pointsEarned: number;

  timeCompleted?: string;

  status: 'entregado' | 'saltado' | 'pendiente';

}



export interface UserStreak {

  currentStreak: number;

  bestStreak: number;

  totalDaysActive: number;

  lastActivityDate: string;

  streakBrokenDays: number; // Días consecutivos perdidos

}



export interface HistoryResponse {

  transactions: HistoryTransaction[];

  activities: DayActivity[];

  streak: UserStreak;

  monthProgress: {

    current: number;

    total: number;

    percentage: number;

  };

}

export interface CollectionItem {
  recyclingTypeId: string;
  quantity: number;
  pointsEarned: number;
}

// ==========================================

// HISTORY SERVICE

// ==========================================



class HistoryService {

  /**

   * Obtener historial completo del usuario desde el endpoint

   */

  async getUserHistory(userId: string): Promise<HistoryTransaction[]> {

    try {

      console.log('📋 Obteniendo historial para usuario:', userId);

     

      const response = await client.get(`/neighbors/${userId}/points-history`);

     

      console.log('✅ Historial obtenido:', response.data);

      return this.transformPointsHistoryToTransactions(response.data);

    } catch (error: any) {

      console.error('❌ Error obteniendo historial:', error.response?.data || error.message);

      throw new Error(error.response?.data?.message || 'Error al obtener historial');

    }

  }



  /**

   * Transformar respuesta del backend a formato de transacciones para UI

   */

  private transformPointsHistoryToTransactions(pointsData: any[]): HistoryTransaction[] {

    return pointsData.map((item) => ({

      id: item.id,

      userId: item.userId,

      collectionId: item.collectionId,

      voucherId: item.voucherId,

      transactionType: item.transactionType,

      points: item.points,

      createdAt: item.createdAt,

      description: item.description,

      // Mapear tipo de actividad para UI

      activityType: this.mapTransactionTypeToActivity(item.transactionType),

      // Determinar status basado en puntos (positivo = entregado, 0 o negativo podrían ser otros casos)

      status: item.points > 0 ? 'entregado' : 'completado',

    }));

  }



  /**

   * Mapear tipo de transacción del backend a tipo de actividad para UI

   */

  private mapTransactionTypeToActivity(transactionType: string): 'basura' | 'reciclaje' | 'encuesta' | 'canje' {

    switch (transactionType) {

      case 'EARN_GARBAGE':

        return 'basura';

      case 'EARN_RECYCLED':

        return 'reciclaje';

      case 'EARN_SURVEY':

        return 'encuesta';

      case 'REDEEM':

        return 'canje';

      default:

        return 'basura';

    }

  }



  /**

   * Registrar nueva colección (QR escaneado + puntos otorgados)

   */

  async registerCollection(data: {
    userId: string;
    truckId?: string;
    operatorUserId?: string;
    activityType: 'basura' | 'reciclaje';
    pointsToAward: number;
    municipalityId: string;
    items?: CollectionItem[]; // <--- AGREGADO: Soporte para múltiples materiales
    customRecyclingTypeId?: string; 
    customQuantity?: number;
  }) {
    try {
      // IDs por defecto para casos simples (como el escaneo directo de Basura)
      const typeMapping: Record<string, string> = {
        'basura': 'b8f687fc-6977-4026-9a0f-b6211a1f8e99',
        'reciclaje': '89956d93-7023-48d3-8bbf-6daf43218bd6',
      };

      const DEFAULT_TRUCK_ID = "7557e17d-00fd-412b-b95c-2ec47f1830c8";

      // Preparamos el array de ítems para el payload
      // Si recibimos 'items' desde la pantalla, los usamos directamente.
      // Si no, construimos un array con un solo elemento (lógica vieja/basura).
      const finalItems = data.items && data.items.length > 0 
        ? data.items 
        : [
            {
              recyclingTypeId: data.customRecyclingTypeId || typeMapping[data.activityType],
              quantity: data.customQuantity || 1,
              pointsEarned: data.pointsToAward,
            }
          ];

      const payload = {
        userId: data.userId,
        municipalityId: data.municipalityId,
        verificationMethod: 'QR_NEIGHBOR',
        truckId: data.truckId || DEFAULT_TRUCK_ID,
        operatorUserId: data.operatorUserId,
        items: finalItems
      };
      
      console.log('📤 Enviando colección al backend:', JSON.stringify(payload, null, 2));
      const response = await client.post('/collections', payload);
      
      // Si el registro es exitoso, podríamos guardar la actividad localmente para el historial offline
      await this.saveActivityToLocal(data.userId, {
        date: new Date().toISOString().split('T')[0],
        hasActivity: true,
        activityType: data.activityType,
        pointsEarned: data.pointsToAward,
        status: 'entregado'
      });

      return { success: true, data: response.data };

    } catch (error: any) {
      console.error('❌ Error registrando colección:', error.response?.data || error.message);
      throw error;
    }
  }

  async registerRecyclingCollection(data: any) {
  try {
    const response = await client.post('/collections', data);
    return {
      success: true,
      data: response.data,
      totalPoints: data.items.reduce((acc: number, item: any) => acc + item.pointsEarned, 0)
    };
  } catch (error) {
    throw error;
  }
}

  /**

   * Obtener datos para mostrar en HomeScreen

   */

  async getHomeScreenData(userId: string): Promise<{

    hasActivityToday: boolean;

    currentStreak: number;

    monthProgress: { current: number; total: number };

    totalPoints: number;

  }> {

    try {

      const transactions = await this.getUserHistory(userId);

      const activities = await this.getLocalActivities(userId);

     

      const today = new Date().toISOString().split('T')[0];

      const todayActivity = activities.find(a => a.date === today);

     

      // Calcular progreso del mes

      const currentMonth = new Date().getMonth();

      const currentYear = new Date().getFullYear();

      const monthActivities = activities.filter(a => {

        const activityDate = new Date(a.date);

        return activityDate.getMonth() === currentMonth &&

               activityDate.getFullYear() === currentYear &&

               a.status === 'entregado';

      });



      // Calcular streak actual

      const streak = this.calculateCurrentStreak(activities);

     

      // Calcular puntos totales

      const totalPoints = transactions.reduce((sum, t) => sum + (t.points > 0 ? t.points : 0), 0);



      return {

        hasActivityToday: todayActivity?.status === 'entregado' || false,

        currentStreak: streak,

        monthProgress: {

          current: monthActivities.length,

          total: new Date(currentYear, currentMonth + 1, 0).getDate(), // Días del mes

        },

        totalPoints,

      };

    } catch (error) {

      console.error('Error obteniendo datos para HomeScreen:', error);

      return {

        hasActivityToday: false,

        currentStreak: 0,

        monthProgress: { current: 0, total: 30 },

        totalPoints: 0,

      };

    }

  }



  /**

   * Calcular racha actual del usuario

   */

  private calculateCurrentStreak(activities: DayActivity[]): number {

    // Ordenar actividades por fecha descendente

    const sortedActivities = activities

      .filter(a => a.status === 'entregado')

      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());



    if (sortedActivities.length === 0) return 0;



    let streak = 0;

    const today = new Date();

    today.setHours(0, 0, 0, 0);



    for (let i = 0; i < sortedActivities.length; i++) {

      const activityDate = new Date(sortedActivities[i].date);

      activityDate.setHours(0, 0, 0, 0);

     

      const expectedDate = new Date(today);

      expectedDate.setDate(today.getDate() - i);



      if (activityDate.getTime() === expectedDate.getTime()) {

        streak++;

      } else {

        break;

      }

    }



    return streak;

  }



  /**

   * Guardar actividad en almacenamiento local

   */

  private async saveActivityToLocal(userId: string, activity: DayActivity): Promise<void> {

    try {

      const key = `user_activities_${userId}`;

      const existing = await AsyncStorage.getItem(key);

      let activities: DayActivity[] = existing ? JSON.parse(existing) : [];

     

      // Actualizar o agregar actividad del día

      const existingIndex = activities.findIndex(a => a.date === activity.date);

      if (existingIndex >= 0) {

        activities[existingIndex] = activity;

      } else {

        activities.push(activity);

      }

     

      // Mantener solo últimos 90 días

      const cutoffDate = new Date();

      cutoffDate.setDate(cutoffDate.getDate() - 90);

      activities = activities.filter(a => new Date(a.date) >= cutoffDate);

     

      await AsyncStorage.setItem(key, JSON.stringify(activities));

      console.log('✅ Actividad guardada localmente para', activity.date);

    } catch (error) {

      console.error('Error guardando actividad local:', error);

    }

  }



  /**

   * Obtener actividades del almacenamiento local

   */

  async getLocalActivities(userId: string): Promise<DayActivity[]> {

    try {

      const key = `user_activities_${userId}`;

      const data = await AsyncStorage.getItem(key);

      return data ? JSON.parse(data) : [];

    } catch (error) {

      console.error('Error obteniendo actividades locales:', error);

      return [];

    }

  }



  /**

   * Marcar día como saltado (para tracking de streaks)

   */

  async markDayAsSkipped(userId: string, date?: string): Promise<void> {

    const dateToMark = date || new Date().toISOString().split('T')[0];

   

    await this.saveActivityToLocal(userId, {

      date: dateToMark,

      hasActivity: false,

      pointsEarned: 0,

      status: 'saltado',

    });

   

    console.log('📅 Día marcado como saltado:', dateToMark);

  }



  /**

   * Formatear fecha para mostrar en UI

   */

  formatDateForDisplay(dateString: string): string {

    const date = new Date(dateString);

    const today = new Date();

    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);



    // Resetear horas para comparación exacta

    today.setHours(0, 0, 0, 0);

    yesterday.setHours(0, 0, 0, 0);

    date.setHours(0, 0, 0, 0);



    if (date.getTime() === today.getTime()) {

      return 'Hoy';

    } else if (date.getTime() === yesterday.getTime()) {

      return 'Ayer';

    } else {

      return date.toLocaleDateString('es-ES', {

        month: 'short',

        day: 'numeric'

      });

    }

  }



  /**

   * Obtener ícono según tipo de actividad

   */

  getActivityIcon(activityType: 'basura' | 'reciclaje' | 'encuesta' | 'canje'): string {

    switch (activityType) {

      case 'basura':

        return '🗑️';

      case 'reciclaje':

        return '♻️';

      case 'encuesta':

        return '📋';

      case 'canje':

        return '🎁';

      default:

        return '🗑️';

    }

  }

  /**
   * Obtener tipos de reciclaje disponibles en el municipio
   * para llenar el combo de selección.
   */
  async getRecyclingTypes(municipalityId: string) {
    try {
      // Endpoint real que descubriste
      const response = await client.get(`/recycling-types?municipalityId=${municipalityId}`);
      return response.data; // Retorna el array [ { name: "Plástico", pointsGiven: 2, ... } ]
    } catch (error) {
      console.error('Error obteniendo tipos de reciclaje:', error);
      // Fallback para pruebas si falla la red
      return [
        { id: 'b8f687fc-6977-4026-9a0f-b6211a1f8e99', name: 'Basura General', pointsGiven: 1, isGarbage: true },
        { id: '6b4dd0f6-ba89-495d-9f6b-db41b8223aeb', name: 'Plástico', pointsGiven: 2, isGarbage: false },
        { id: 'b8350d82-643d-4c84-ace4-0285d3558871', name: 'Papel y Cartón', pointsGiven: 3, isGarbage: false },
      ];
    }
  }

}



// ==========================================

// EXPORT SINGLETON

// ==========================================



export default new HistoryService();