import { StyleSheet } from 'react-native';

/**
 * Estilos para ServicesScreen
 * Pantalla de selección de servicios de camiones
 * 
 * @path mobile/src/styles/screens/auth/ServicesScreen.styles.ts
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
  // CONTENT
  // ==========================================
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ==========================================
  // HEADER
  // ==========================================
  header: {
    paddingTop: 48,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ==========================================
  // HERO SECTION
  // ==========================================
  heroSection: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },

  // ==========================================
  // SERVICES SECTION
  // ==========================================
  servicesSection: {
    marginBottom: 32,
  },

  // ==========================================
  // TIME SECTION
  // ==========================================
  timeSection: {
    marginBottom: 32,
  },
  timeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#2563EB',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  timeButtonTextActive: {
    color: '#FFFFFF',
  },

  // ==========================================
  // FOOTER
  // ==========================================
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
});