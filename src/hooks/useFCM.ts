import { useState, useEffect, useCallback } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * useFCM Hook
 * Maneja la obtención y actualización de tokens FCM/APNS
 * Integrado para ReciclaPE
 */

interface FCMHookReturn {
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
}

export const useFCM = (): FCMHookReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  // Configurar handler de notificaciones
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  /**
   * Verificar si tenemos permisos de notificaciones
   */
  const checkPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const granted = status === 'granted';
      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }, []);

  /**
   * Solicitar permisos de notificaciones
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return false;
      }

      // Configurar canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#22C55E', // Verde de ReciclaPE
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      const granted = finalStatus === 'granted';
      setHasPermissions(granted);
      
      if (!granted) {
        setError('Permisos de notificación denegados');
        console.warn('Push notification permissions not granted');
      }
      
      return granted;
    } catch (error: any) {
      setError(`Error requesting permissions: ${error.message}`);
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, []);

  /**
   * Obtener FCM/APNS token
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!Device.isDevice) {
        console.warn('Must use physical device for Push Notifications');
        return null;
      }

      // Verificar/solicitar permisos
      const hasPerms = await checkPermissions();
      if (!hasPerms) {
        const granted = await requestPermissions();
        if (!granted) {
          return null;
        }
      }

      // Obtener Project ID desde app.json
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error('No EAS project ID found in app.json');
        setError('Configuración de proyecto faltante');
        return null;
      }

      console.log('🔄 Obteniendo FCM token...');

      // Obtener Expo Push Token
      const expoPushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      console.log('✅ Expo Push Token obtenido');

      // Obtener Device Push Token (FCM para Android, APNS para iOS)
      const deviceTokenData = await Notifications.getDevicePushTokenAsync();
      const deviceToken = deviceTokenData.data;

      console.log(`✅ ${Platform.OS === 'android' ? 'FCM' : 'APNS'} Token obtenido:`, 
                  deviceToken.substring(0, 50) + '...');

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('fcmToken', deviceToken);
      await AsyncStorage.setItem('expoPushToken', expoPushTokenData.data);

      return deviceToken;

    } catch (error: any) {
      console.error('Error getting FCM token:', error);
      setError(`Error obteniendo token: ${error.message}`);
      return null;
    }
  }, [checkPermissions, requestPermissions]);

  /**
   * Refrescar token FCM
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      setFcmToken(token);
      
      if (token) {
        console.log('✅ FCM Token actualizado exitosamente');
      }
    } catch (error: any) {
      console.error('Error refreshing FCM token:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  /**
   * Cargar token guardado al inicializar
   */
  useEffect(() => {
    const loadSavedToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('fcmToken');
        if (savedToken && savedToken.length > 20) {
          setFcmToken(savedToken);
          console.log('✅ FCM Token cargado desde AsyncStorage');
        }
        
        // Verificar permisos
        await checkPermissions();
      } catch (error) {
        console.error('Error loading saved token:', error);
      }
    };

    loadSavedToken();
  }, [checkPermissions]);

  return {
    fcmToken,
    isLoading,
    error,
    refreshToken,
    requestPermissions,
    hasPermissions,
  };
};