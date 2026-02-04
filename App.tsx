import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import linking from './src/navigation/LinkingConfiguration';
import { initSessionCheck } from './src/utils/auth.utils';
import authService from './services/api/auth.service';

// ✅ FIXED: Declaración de tipos para global
declare global {
  var __notificationListener: any;
  var __responseListener: any;
}

export default function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Iniciando ReciclaPE...');
      
      // 1. Verificar sesión existente
      await initSessionCheck();
      console.log('✅ Verificación de sesión completada');
      
      // 2. ✅ NUEVO: Configurar sistema de notificaciones
      await setupNotificationSystem();
      
      // 3. ✅ ACTUALIZADO: Actualizar FCM token si el usuario está logueado
      await authService.refreshFcmTokenIfNeeded();
      console.log('✅ Verificación de FCM token completada');
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const setupNotificationSystem = async () => {
    try {
      console.log('🔄 Configurando sistema de notificaciones...');
      
      if (Platform.OS === 'android') {
        console.log('🤖 Configurando notificaciones para Android');
        
        try {
          // Configurar notificaciones para Android
          const Notifications = await import('expo-notifications');
          
          // ✅ FIXED: Agregar todas las propiedades requeridas
          Notifications.default.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
              shouldShowBanner: true,  // ✅ ADDED
              shouldShowList: true,    // ✅ ADDED
            }),
          });

          // Configurar canal de notificaciones
          await Notifications.default.setNotificationChannelAsync('default', {
            name: 'ReciclaPE Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#22C55E', // Verde de ReciclaPE
          });

          console.log('✅ Android: Sistema de notificaciones configurado');
        } catch (notificationError) {
          console.log('⚠️ Error configurando notificaciones Android:', notificationError);
        }
        
      } else if (Platform.OS === 'ios') {
        console.log('🍎 Configurando notificaciones para iOS');
        
        try {
          const Notifications = await import('expo-notifications');
          
          // ✅ FIXED: Agregar todas las propiedades requeridas
          Notifications.default.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
              shouldShowBanner: true,  // ✅ ADDED
              shouldShowList: true,    // ✅ ADDED
            }),
          });

          console.log('✅ iOS: Sistema de notificaciones configurado');
        } catch (notificationError) {
          console.log('⚠️ Error configurando notificaciones iOS:', notificationError);
        }
      }

      // Configurar listeners de notificaciones
      await setupNotificationListeners();
      
      console.log('✅ Sistema de notificaciones completamente configurado');
      
    } catch (error) {
      console.log('⚠️ Error configurando sistema de notificaciones:', error);
      // No bloquear la app si las notificaciones fallan
    }
  };

  const setupNotificationListeners = async () => {
    try {
      const Notifications = await import('expo-notifications');
      
      // ✅ LISTENER: Notificaciones recibidas mientras la app está abierta
      const notificationListener = Notifications.default.addNotificationReceivedListener(notification => {
        console.log('🔔 Notificación recibida en foreground:', notification.request.content.title);
        
        const notificationData = notification.request.content.data;
        
        // Manejar diferentes tipos de notificaciones
        if (notificationData?.type === 'TRUCK_NEARBY') {
          console.log('🚛 Camión cerca detectado');
          
          // Mostrar alert para camiones cercanos
          Alert.alert(
            '🚛 ¡Camión cerca!',
            notification.request.content.body || 'El camión está llegando a tu zona',
            [
              { 
                text: 'Ver ubicación', 
                onPress: () => {
                  console.log('📍 Navegando a ubicación del camión');
                  // Aquí podrías navegar a la pantalla de mapa/camiones
                }
              }, 
              { text: 'OK', style: 'default' }
            ]
          );
        } else if (notificationData?.type === 'COLLECTION_REMINDER') {
          console.log('♻️ Recordatorio de recolección recibido');
        } else if (notificationData?.type === 'POINTS_EARNED') {
          console.log('⭐ Puntos ganados recibido');
        } else {
          console.log('📢 Notificación general recibida');
        }
      });

      // ✅ LISTENER: Respuesta a notificaciones (cuando el usuario las toca)
      const responseListener = Notifications.default.addNotificationResponseReceivedListener(response => {
        console.log('👆 Usuario tocó notificación:', response.notification.request.content.title);
        
        const notificationData = response.notification.request.content.data;
        
        // Navegar basado en el tipo de notificación
        if (notificationData?.type === 'TRUCK_NEARBY') {
          console.log('📍 Abrir pantalla de camiones/mapa');
          // navigation.navigate('TruckMap'); // Ejemplo
        } else if (notificationData?.type === 'COLLECTION_REMINDER') {
          console.log('♻️ Abrir pantalla de reciclaje');
          // navigation.navigate('Collections'); // Ejemplo
        } else if (notificationData?.type === 'POINTS_EARNED') {
          console.log('⭐ Abrir pantalla de puntos');
          // navigation.navigate('Points'); // Ejemplo
        }
      });

      console.log('✅ Listeners de notificaciones configurados');
      
      // ✅ FIXED: Guardar referencias sin usar global directamente
      (global as any).__notificationListener = notificationListener;
      (global as any).__responseListener = responseListener;
      
    } catch (error) {
      console.log('⚠️ Error configurando listeners de notificaciones:', error);
    }
  };

  // ✅ CLEANUP: Limpiar listeners al desmontar la app
  useEffect(() => {
    return () => {
      try {
        // ✅ FIXED: Usar casting de tipo para evitar errores
        const globalAny = global as any;
        
        if (globalAny.__notificationListener) {
          const Notifications = require('expo-notifications').default;
          Notifications.removeNotificationSubscription(globalAny.__notificationListener);
        }
        if (globalAny.__responseListener) {
          const Notifications = require('expo-notifications').default;
          Notifications.removeNotificationSubscription(globalAny.__responseListener);
        }
      } catch (error) {
        console.log('Error cleaning up notification listeners:', error);
      }
    };
  }, []);

  if (isCheckingSession) {
    return null; // O tu componente de loading/splash screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="#FFFFFF" 
        />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}