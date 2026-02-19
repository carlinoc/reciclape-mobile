import { Platform, StyleSheet } from 'react-native';

/**
 * Estilos para LoginScreen
 * @styles Auth/Login
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },

  // ==========================================
  // HEADER
  // ==========================================
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },

  // ==========================================
  // CONTENT
  // ==========================================
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  // ==========================================
  // HERO SECTION
  // ==========================================
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  // ==========================================
  // FORM SECTION
  // ==========================================
  formSection: {
    marginBottom: 24,
  },
  infoBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#EFF6FF', // blue-50
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // ==========================================
  // FOOTER
  // ==========================================
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});