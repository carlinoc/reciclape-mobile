import { StyleSheet } from 'react-native';

/**
 * Estilos para HistoryScreen
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
    paddingBottom: 100, // Espacio para bottom nav
  },

  // ==========================================
  // EMPTY STATE (Sin historial)
  // ==========================================
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ==========================================
  // HISTORY ITEMS (Tarjetas de entrega)
  // ==========================================
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyItemType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
    marginRight: 8,
  },
  
  // ==========================================
  // BADGES DE ESTADO
  // ==========================================
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeSkipped: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextDelivered: {
    color: '#166534',
  },
  statusTextSkipped: {
    color: '#991B1B',
  },

  // ==========================================
  // FECHA Y HORA
  // ==========================================
  historyItemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyItemSeparator: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 6,
  },
  historyItemTime: {
    fontSize: 14,
    color: '#6B7280',
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