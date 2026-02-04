import { StyleSheet } from 'react-native';

/**
 * Estilos para RecyclingRegistrationScreen
 * Pantalla con código QR para que el operario escanee
 */
export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER PRINCIPAL
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ==========================================
  // HEADER
  // ==========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 28,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },

  // ==========================================
  // SCROLL VIEW
  // ==========================================
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },

  // ==========================================
  // QR SECTION
  // ==========================================
  qrSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  recyclingIcon: {
    fontSize: 64,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  // ==========================================
  // QR CODE CONTAINER
  // ==========================================
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrPlaceholder: {
    width: 240,
    height: 240,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // ==========================================
  // USER INFO
  // ==========================================
  infoContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoTextBold: {
    fontWeight: '600',
    color: '#111827',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  // ==========================================
  // BUTTON CONTAINER
  // ==========================================
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
});