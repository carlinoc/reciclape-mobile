// src/utils/auth.utils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';

/**
 * Guardar timestamp de última actividad
 */
export const updateLastActivity = async (): Promise<void> => {
  try {
    const now = Date.now().toString();
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, now);
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
};

/**
 * Verificar si la sesión ha expirado
 * @returns true si la sesión expiró, false si sigue válida
 */
export const hasSessionExpired = async (): Promise<boolean> => {
  try {
    const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    
    if (!lastActivity) {
      return false; // Primera vez, no hay sesión previa
    }

    const lastActivityTime = parseInt(lastActivity, 10);
    const now = Date.now();
    const timeDiff = now - lastActivityTime;

    return timeDiff > SESSION_TIMEOUT;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return false;
  }
};

/**
 * Cerrar sesión - limpia todos los datos del usuario
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      'authToken',
      'userId',
      'hasCompletedOnboarding',
      'userPreferences',
      LAST_ACTIVITY_KEY,
      'userData',
    ]);
    console.log('✅ Sesión cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Inicializar verificación de sesión
 * Debe llamarse al iniciar la app
 */
export const initSessionCheck = async (): Promise<boolean> => {
  const expired = await hasSessionExpired();
  
  if (expired) {
    console.log('⏰ Sesión expirada, cerrando automáticamente');
    await logout();
    return false;
  }

  // Actualizar última actividad
  await updateLastActivity();
  return true;
};