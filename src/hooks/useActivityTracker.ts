// src/hooks/useActivityTracker.ts
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { updateLastActivity, hasSessionExpired, logout } from '../utils/auth.utils';

/**
 * Hook para rastrear actividad del usuario y manejar expiración de sesión
 */
export const useActivityTracker = (onSessionExpired: () => void) => {
  useEffect(() => {
    // Actualizar actividad al montar
    updateLastActivity();

    // Listener de estado de la app
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App volvió al foreground, verificar si la sesión expiró
        const expired = await hasSessionExpired();
        
        if (expired) {
          await logout();
          onSessionExpired();
        } else {
          // Sesión válida, actualizar última actividad
          updateLastActivity();
        }
      }
    });

    // Actualizar actividad cada minuto mientras la app está activa
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        updateLastActivity();
      }
    }, 60000); // 1 minuto

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [onSessionExpired]);
};