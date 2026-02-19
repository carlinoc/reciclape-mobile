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
  // HERO SECTION
  // ==========================================
  heroSection: {
    marginBottom: 0,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 0,
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
    marginBottom: 22,
  },

  // ==========================================
  // TIME SECTION
  // ==========================================
  timeSection: {
    marginBottom: 22,
  },
  timeSectionTitle: {
    fontSize: 16,
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

  confirmButton: {
    marginTop: 16,
    marginBottom: 20,
  },

  infoEntity: {
    marginTop: 12,
    marginBottom: 0,
  },
  infoEntityContent:{
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 0,
    marginHorizontal: 4,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    marginTop: 10,
  },
  infoEntityText: {
    fontSize: 14, 
    color: '#1E40AF', 
    lineHeight: 20
  },

  notifyConte:{
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 0,
    marginHorizontal: 4,
  },
  notifyConteText: {
    fontSize: 14, 
    color: '#1E40AF', 
    lineHeight: 20
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