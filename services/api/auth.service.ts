import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FCMService from '../firebase/fcm.service';
import { Alert } from 'react-native';

// ============================================
// INTERFACES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;  // Opcional en login, pero importante para notificaciones
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    municipalityId?: string;
    isActive?: boolean;
  };
}

export interface RegisterNeighborRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dni?: string;
  districtId: string;
  street: string;
  latitude: number;
  longitude: number;
  municipalityId?: string;
  isActive?: boolean;
  fcmToken?: string;  // Opcional en registro
  device?: string;
  notifyBefore?: number | null;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  // ... otros campos
}

// ============================================
// AUTH SERVICE
// ============================================

class AuthService {
  /**
   * Login con email + password + fcmToken REAL
   * POST /auth/neighbors/login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // ✅ NUEVO: Obtener FCM Token REAL del dispositivo
      let fcmToken = data.fcmToken;
      
      if (!fcmToken) {
        try {
          console.log('🔄 Obteniendo FCM token para login...');
          const token = await FCMService.getCurrentToken();
          fcmToken = token || undefined; // Convertir null a undefined
          
          if (fcmToken) {
            console.log('✅ FCM Token obtenido:', fcmToken.substring(0, 50) + '...');
          } else {
            console.log('⚠️ No se pudo obtener FCM token - continuando sin él');
          }
        } catch (error) {
          console.log('⚠️ Error obteniendo FCM token:', error);
        }
      }

      // Enviar login con FCM token real
      const response = await client.post<LoginResponse>('/auth/neighbors/login', {
        email: data.email,
        password: data.password,
        fcmToken: fcmToken || null,
      });

      const { accessToken, user } = response.data;

      // Guardar datos de sesión
      await AsyncStorage.setItem('authToken', accessToken);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      console.log('✅ Login exitoso:', user.email);
      console.log('👤 Usuario ID:', user.id);
      
      if (fcmToken) {
        console.log('🔔 FCM Token enviado al backend correctamente');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Credenciales inválidas');
    }
  }

  /**
   * Registrar nuevo vecino con FCM token
   * POST /neighbors
   */
  async registerNeighbor(data: RegisterNeighborRequest): Promise<RegisterResponse> {
    try {
      let fcmToken = data.fcmToken;
      if (!fcmToken) {
        try {
          console.log('🔄 Obteniendo FCM token para registro...');
          const token = await FCMService.getCurrentToken();
          fcmToken = token || undefined; // Convertir null a undefined
          
          if (fcmToken) {
            console.log('✅ FCM Token obtenido para registro:', fcmToken.substring(0, 50) + '...');
          }
        } catch (error) {
          console.log('⚠️ Error obteniendo FCM token para registro:', error);
        }
      }

      const payload = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dni: data.dni || null,
        districtId: data.districtId,
        street: data.street,
        latitude: data.latitude,
        longitude: data.longitude,
        municipalityId: data.municipalityId || null,
        fcmToken: fcmToken || null,
        device: data.device || 'Android',
        notifyBefore : data.notifyBefore || null,
      };

      console.log('📤 Registrando vecino:', payload.email);
      
      const response = await client.post<RegisterResponse>('/neighbors', payload);

      console.log('✅ Vecino registrado exitosamente:', response.data);
      
      if (fcmToken) {
        console.log('🔔 FCM Token incluido en registro');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Actualizar FCM Token del usuario
   * PATCH /neighbors/fcm-token/{id}
   */
  async updateFcmToken(userId: string, fcmToken?: string): Promise<void> {
    try {
      let tokenToUpdate = fcmToken;
      
      if (!tokenToUpdate) {
        const token = await FCMService.getCurrentToken();
        tokenToUpdate = token || undefined; // Convertir null a undefined
      }
      
      if (!tokenToUpdate) {
        console.log('⚠️ No hay FCM token para actualizar');
        return;
      }

      console.log('📤 Actualizando FCM token para usuario:', userId);
      console.log('🔑 Token:', tokenToUpdate.substring(0, 50) + '...');

      await client.patch(`/neighbors/fcm-token/${userId}`, { 
        fcmToken: tokenToUpdate 
      });
      
      console.log('✅ FCM Token actualizado exitosamente en servidor');
    } catch (error: any) {
      console.error('❌ Error actualizando FCM Token:', error.response?.data || error.message);
      // No lanzar error, FCM token es opcional pero logear el error
    }
  }

  /**
   * Función para actualizar FCM token cuando la app se inicia
   */
  async refreshFcmTokenIfNeeded(): Promise<void> {
    try {
      const userData = await this.getUserData();
      if (userData?.id) {
        console.log('🔄 Verificando/actualizando FCM token al iniciar app');
        
        // Obtener token fresh del dispositivo
        const currentToken = await FCMService.getCurrentToken();
        
        if (currentToken) {
          await this.updateFcmToken(userData.id, currentToken);
          console.log('✅ FCM token verificado y actualizado');
        } else {
          console.log('⚠️ No se pudo obtener FCM token al iniciar');
        }
      }
    } catch (error) {
      console.log('⚠️ Error refreshing FCM token:', error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   * GET /neighbors/{id}
   */
  async getProfile(userId: string): Promise<any> {
    try {
      const response = await client.get(`/neighbors/${userId}`);
      
      // Actualizar datos locales
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo perfil:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  }

  /**
   * Verificar si hay sesión activa
   */
  async checkSession(): Promise<{ isAuthenticated: boolean; user: any | null }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        return {
          isAuthenticated: true,
          user: JSON.parse(userData),
        };
      }

      return { isAuthenticated: false, user: null };
    } catch (error) {
      console.error('Error checking session:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Cerrar sesión
   * POST /auth/neighbors/logout/{userId}
   */
  async logout(userId?: string): Promise<void> {
    try {
      // Llamar al endpoint de logout del servidor
      if (userId) {
        console.log('📤 Cerrando sesión en servidor para usuario:', userId);
        await client.post(`/auth/neighbors/logout/${userId}`);
        console.log('✅ Logout exitoso en servidor');
      }
    } catch (error: any) {
      // Ignorar errores del servidor, limpiar localmente de todas formas
      console.log('⚠️ Logout del servidor falló, limpiando datos locales:', error.response?.data || error.message);
    }

    // Limpiar FCM Token
    try {
      await FCMService.clearToken();
      console.log('✅ FCM Token limpiado');
    } catch (fcmError) {
      console.log('⚠️ Error limpiando FCM Token:', fcmError);
    }

    // Limpiar datos locales
    await AsyncStorage.multiRemove([
      'authToken',
      'userId',
      'userData',
      'tempUserData',
      'userPreferences',
      'hasCompletedOnboarding',
      'fcmToken',
    ]);
    
    console.log('✅ Sesión cerrada localmente');
  }

  /**
   * Obtener token almacenado
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('authToken');
  }

  /**
   * Obtener datos del usuario almacenados
   */
  async getUserData(): Promise<any | null> {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Obtener FCM token actual del dispositivo
   */
  async getCurrentFcmToken(): Promise<string | null> {
    return await FCMService.getCurrentToken();
  }
}

export default new AuthService();