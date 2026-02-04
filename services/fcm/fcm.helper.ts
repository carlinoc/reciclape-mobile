// services/fcm/fcm.helper.ts
/**
 * Helper simple para FCM que evita errores uncaught
 * Se usa cuando Firebase no está instalado
 */

let isFirebaseAvailable = false;
let FCMService: any = null;

// Verificar si Firebase está disponible una sola vez
try {
  FCMService = require('./fcm.service').default;
  isFirebaseAvailable = true;
} catch (error) {
  // Firebase no está disponible - usar fallbacks
  isFirebaseAvailable = false;
  FCMService = null;
}

/**
 * Obtener FCM Token de forma segura
 */
export const getFCMTokenSafe = async (): Promise<string | null> => {
  if (!isFirebaseAvailable || !FCMService) {
    return null;
  }
  
  try {
    return await FCMService.getFCMToken();
  } catch (error) {
    return null;
  }
};

/**
 * Limpiar FCM Token de forma segura
 */
export const clearFCMTokenSafe = async (): Promise<void> => {
  if (!isFirebaseAvailable || !FCMService) {
    return;
  }
  
  try {
    await FCMService.clearToken();
  } catch (error) {
    // Ignorar errores
  }
};

/**
 * Verificar si Firebase está disponible
 */
export const isFirebaseReady = (): boolean => {
  return isFirebaseAvailable;
};