import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Estilos para PreferencesScreen
 * Basado en el diseño de Figma con adaptaciones para React Native
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
    paddingTop: 48,
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
    paddingVertical: 24,
    paddingBottom: 160, // Espacio para botón guardar + bottom nav
  },

  // ==========================================
  // SECCIONES
  // ==========================================
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },

  // ==========================================
  // TARJETA DE CUENTA
  // ==========================================
  accountCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  accountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  accountTextSecondary: {
    fontSize: 16,
    color: '#6B7280',
  },

  // ==========================================
  // BOTONES DE TIEMPO
  // ==========================================
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
  // CERRAR SESIÓN
  // ==========================================
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E53935',
    textAlign: 'left',
  },

  // ==========================================
  // BOTÓN GUARDAR (FIXED)
  // ==========================================
  saveButtonContainer: {
    position: 'absolute',
    bottom: 80, // Altura del bottom nav
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  // ==========================================
  // BOTTOM NAVIGATION
  // ==========================================
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
});