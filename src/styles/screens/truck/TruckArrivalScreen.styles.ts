import { StyleSheet } from 'react-native';

/**
 * Estilos para TruckArrivalScreen
 * Pantalla con icono grande y botones de acción
 */
export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER PRINCIPAL
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // ==========================================
  // CONTENT
  // ==========================================
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },

  // ==========================================
  // HEADER (Icono y texto)
  // ==========================================
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  truckIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },

  // ==========================================
  // BUTTONS CONTAINER
  // ==========================================
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
});