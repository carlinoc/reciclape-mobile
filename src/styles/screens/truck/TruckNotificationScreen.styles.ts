import { StyleSheet } from 'react-native';

/**
 * Estilos para TruckNotificationScreen
 * Pantalla minimalista con notificación centrada
 */
export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER PRINCIPAL
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gris muy claro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // ==========================================
  // NOTIFICATION CARD
  // ==========================================
  notificationCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FEF3C7', // Amarillo suave
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  notificationArrow: {
    fontSize: 20,
    color: '#2563EB',
    marginLeft: 8,
  },
});