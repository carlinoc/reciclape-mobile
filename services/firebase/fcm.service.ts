import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * FCM Service para ReciclaPE
 * Maneja tokens FCM reales para notificaciones push
 * Compatible con Expo Go y Development Builds
 */

class FCMService {
  private fcmToken: string | null = null;

  constructor() {
    this.initializeNotificationHandler();
  }

  /**
   * Configurar el handler de notificaciones
   */
  private initializeNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  /**
   * Solicitar permisos de notificaciones
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('❌ FCM requiere dispositivo físico');
        return false;
      }

      // Configurar canal para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'ReciclaPE Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#22C55E',
        });
      }

      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      const granted = finalStatus === 'granted';
      if (!granted) {
        console.warn('❌ Permisos de notificación denegados');
      }
      
      return granted;
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  }

  /**
   * Obtener FCM Token real del dispositivo
   */
  async getFCMToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('❌ FCM requiere dispositivo físico');
        return null;
      }

      // Verificar/solicitar permisos
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        return null;
      }

      // Obtener Project ID desde app.json
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error('❌ No se encontró EAS project ID en app.json');
        return null;
      }

      console.log('🔄 Obteniendo FCM token del dispositivo...');

      // Obtener Device Push Token (FCM para Android, APNS para iOS)
      const deviceTokenData = await Notifications.getDevicePushTokenAsync();
      const fcmToken = deviceTokenData.data;

      if (fcmToken && fcmToken.length > 20) {
        // Guardar token localmente
        await AsyncStorage.setItem('fcmToken', fcmToken);
        this.fcmToken = fcmToken;
        
        console.log('✅ FCM Token obtenido exitosamente');
        console.log(`📱 Plataforma: ${Platform.OS}`);
        console.log(`🔑 Token (primeros 50 chars): ${fcmToken.substring(0, 50)}...`);
        
        return fcmToken;
      }

      console.warn('❌ Token FCM vacío o inválido');
      return null;

    } catch (error: any) {
      console.error('❌ Error obteniendo FCM token:', error.message);
      return null;
    }
  }

  /**
   * Obtener token guardado localmente
   */
  async getSavedToken(): Promise<string | null> {
    try {
      const savedToken = await AsyncStorage.getItem('fcmToken');
      if (savedToken && savedToken.length > 20) {
        this.fcmToken = savedToken;
        return savedToken;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo token guardado:', error);
      return null;
    }
  }

  /**
   * Obtener token actual (guardado o nuevo)
   */
  async getCurrentToken(): Promise<string | null> {
    // Primero intentar obtener token guardado
    const savedToken = await this.getSavedToken();
    if (savedToken) {
      return savedToken;
    }

    // Si no hay token guardado, obtener uno nuevo
    return await this.getFCMToken();
  }

  /**
   * Limpiar token almacenado
   */
  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('fcmToken');
      this.fcmToken = null;
      console.log('✅ FCM Token limpiado');
    } catch (error) {
      console.error('Error limpiando FCM token:', error);
    }
  }

  /**
   * Configurar listeners para notificaciones recibidas
   */
  setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void
  ) {
    // Listener para notificaciones recibidas en foreground
    const receivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificación recibida:', notification.request.content.title);
      
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener para cuando el usuario toca una notificación
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuario tocó notificación:', response.notification.request.content.title);
      
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });

    // ✅ CORREGIDO: Usar la API correcta para remover subscripciones
    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }

  /**
   * Verificar si las notificaciones están habilitadas
   */
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }

  /**
   * Obtener información del dispositivo
   */
  getDeviceInfo() {
    return {
      isDevice: Device.isDevice,
      platform: Platform.OS,
      deviceName: Device.deviceName,
      osVersion: Platform.Version,
    };
  }
}

// Exportar instancia singleton
export default new FCMService();