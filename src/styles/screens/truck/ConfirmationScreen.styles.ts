import { StyleSheet } from 'react-native';

/**
 * Estilos para ConfirmationScreen
 * Pantalla de confirmación exitosa
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
  // SUCCESS ICON
  // ==========================================
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 24,
  },

  // ==========================================
  // TEXT
  // ==========================================
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },

  // ==========================================
  // BUTTON
  // ==========================================
  buttonContainer: {
    width: '100%',
  },
});