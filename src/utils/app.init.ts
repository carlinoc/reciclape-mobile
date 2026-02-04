import FCMService from '../../services/firebase/fcm.service';

/**
 * Inicializar servicios de la aplicación
 * Llamar desde App.tsx después de verificar la sesión
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('🚀 Inicializando aplicación...');

    // Inicializar FCM para notificaciones
    try {
      await FCMService.initialize();
      console.log('✅ FCM inicializado correctamente');
    } catch (fcmError) {
      console.warn('⚠️ FCM no se pudo inicializar:', fcmError);
      // La app puede continuar sin FCM
    }

    // Aquí puedes agregar otras inicializaciones:
    // - Analytics
    // - Crashlytics
    // - Geolocation
    // - etc.

    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
  }
};

/**
 * Inicialización específica para usuario autenticado
 * Llamar después del login exitoso
 */
export const initializeUserServices = async (userId: string): Promise<void> => {
  try {
    console.log('👤 Inicializando servicios de usuario...');

    // Actualizar FCM Token en el servidor
    const fcmToken = FCMService.getCurrentToken();
    if (fcmToken && userId) {
      const authService = require('../services/api/auth.service').default;
      await authService.updateFcmToken(userId, fcmToken);
      console.log('✅ FCM Token actualizado para usuario:', userId);
    }

    console.log('✅ Servicios de usuario inicializados');
  } catch (error) {
    console.error('❌ Error inicializando servicios de usuario:', error);
  }
};