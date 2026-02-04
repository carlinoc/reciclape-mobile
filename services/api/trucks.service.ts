import apiClient from './client';
import { API_ENDPOINTS } from '../../src/navigation/api.config';

/**
 * Trucks Service
 * Servicio para gestión de camiones, posiciones GPS y notificaciones de proximidad
 * 
 * @path mobile/src/services/api/trucks.service.ts
 */

// ==========================================
// INTERFACES
// ==========================================

export interface Truck {
  id: string;
  licensePlate: string;
  truckTypeId: string;
  truckType?: TruckType;
  zoneId: string;
  zone?: Zone;
  isActive: boolean;
  deviceId: string;
  qrCode: string;
  createdAt: string;
}

export interface TruckType {
  id: string;
  type: 'COMPACTADORA' | 'FURGON' | 'VOLQUETE';
  description?: string;
}

export interface Zone {
  id: string;
  name: string;
  municipalityId: string;
  color: string;
  isActive: boolean;
}

export interface TruckPosition {
  id: string;
  truckId: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  speed: number;
  heading: number;
  accuracy: number;
  timestamp: string;
}

export interface NearbyTrucksRequest {
  latitude: number;
  longitude: number;
  radiusMeters?: number; // Default: 5000
  truckTypeId?: string;
}

export interface NearbyTruck extends Truck {
  distance: number; // distancia en metros
  eta: number; // tiempo estimado de llegada en minutos
  currentPosition: TruckPosition;
}

export interface TruckPositionUpdate {
  truckId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  speed?: number;
  heading?: number;
  accuracy?: number;
}

// ==========================================
// TRUCKS SERVICE
// ==========================================

class TrucksService {
  /**
   * Obtener todos los camiones
   */
  async getTrucks(): Promise<Truck[]> {
    try {
      const response = await apiClient.get<Truck[]>(API_ENDPOINTS.TRUCKS.BASE);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener camiones');
    }
  }

  /**
   * Obtener un camión por ID
   */
  async getTruckById(truckId: string): Promise<Truck> {
    try {
      const response = await apiClient.get<Truck>(
        API_ENDPOINTS.TRUCKS.BY_ID(truckId)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener camión');
    }
  }

  /**
   * Obtener camiones por zona
   */
  async getTrucksByZone(zoneId: string): Promise<Truck[]> {
    try {
      const response = await apiClient.get<Truck[]>(
        API_ENDPOINTS.TRUCKS.BY_ZONE(zoneId)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener camiones de la zona');
    }
  }

  /**
   * Obtener posiciones históricas de un camión
   */
  async getTruckPositions(
    truckId: string,
    limit?: number,
    startDate?: string,
    endDate?: string
  ): Promise<TruckPosition[]> {
    try {
      const params: any = {};
      if (limit) params.limit = limit;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get<TruckPosition[]>(
        API_ENDPOINTS.TRUCKS.POSITIONS(truckId),
        { params }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener posiciones del camión');
    }
  }

  /**
   * Obtener camiones cercanos a una ubicación
   * (Usado en HomeScreen para mostrar camiones en tiempo real)
   */
  async getNearbyTrucks(data: NearbyTrucksRequest): Promise<NearbyTruck[]> {
    try {
      const response = await apiClient.post<NearbyTruck[]>(
        API_ENDPOINTS.TRUCKS.NEARBY,
        {
          latitude: data.latitude,
          longitude: data.longitude,
          radiusMeters: data.radiusMeters || 5000,
          truckTypeId: data.truckTypeId,
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener camiones cercanos');
    }
  }

  /**
   * Actualizar posición de un camión (para operadores)
   */
  async updateTruckPosition(data: TruckPositionUpdate): Promise<TruckPosition> {
    try {
      const response = await apiClient.post<TruckPosition>(
        API_ENDPOINTS.TRUCKS.POSITIONS(data.truckId),
        {
          location: {
            type: 'Point',
            coordinates: [data.location.longitude, data.location.latitude],
          },
          speed: data.speed || 0,
          heading: data.heading || 0,
          accuracy: data.accuracy || 0,
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar posición del camión');
    }
  }

  /**
   * Calcular distancia entre dos puntos geográficos (en metros)
   * Usa la fórmula de Haversine
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  /**
   * Calcular ETA (tiempo estimado de llegada) en minutos
   * Basado en distancia y velocidad promedio
   */
  calculateETA(distanceMeters: number, speedKmh: number = 20): number {
    if (speedKmh === 0) speedKmh = 20; // Velocidad promedio si está detenido
    
    const distanceKm = distanceMeters / 1000;
    const timeHours = distanceKm / speedKmh;
    const timeMinutes = Math.ceil(timeHours * 60);

    return timeMinutes;
  }

  /**
   * Formatear distancia para mostrar al usuario
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Formatear ETA para mostrar al usuario
   */
  formatETA(minutes: number): string {
    if (minutes < 1) {
      return 'Menos de 1 min';
    } else if (minutes === 1) {
      return '1 min';
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
  }
}

// ==========================================
// EXPORT SINGLETON
// ==========================================

export default new TrucksService();