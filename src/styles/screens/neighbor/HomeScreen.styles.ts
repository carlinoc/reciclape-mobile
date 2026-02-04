import { StyleSheet } from 'react-native';

/**
 * Estilos para HomeScreen (Dashboard principal del vecino)
 * @styles Neighbor/Home
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },

  // ==========================================
  // HEADER
  // ==========================================
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 999,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Puntaje total
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  pointsIcon: {
    fontSize: 36,
  },
  pointsContent: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#15803D',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#15803D',
  },

  // ==========================================
  // MAIN CONTENT
  // ==========================================
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 24,
  },

  // Camión card
  truckCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
    padding: 20,
  },
  truckCardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  truckIcon: {
    fontSize: 28,
  },
  truckCardHeaderText: {
    flex: 1,
  },
  truckCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  truckCardSubtitle: {
    fontSize: 14,
    color: '#475569',
  },
  truckTimeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  truckTimeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  truckTime: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563EB',
  },
  truckTimeRight: {
    alignItems: 'center',
  },
  truckClockIcon: {
    fontSize: 32,
  },
  truckEta: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },
  truckInstructions: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Success card (cuando ya sacó la basura)
  successCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  successBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 12,
  },
  successBadgeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successMessage: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },

  // Warning card (sin camiones configurados)
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 20,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 16,
    textAlign: 'center',
  },

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
  statsContainer: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statIcon: {
    fontSize: 28,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  statContent: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValueContainer: {
    flex: 1,
  },
  statValueLarge: {
    fontSize: 36,
    fontWeight: '600',
    color: '#4CAF50',
  },
  statValueLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statEmoji: {
    fontSize: 48,
  },
  statFooter: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },

  // Progreso
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#475569',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressBarContainer: {
    height: 16,
    backgroundColor: '#E0E7FF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  statFooterHighlight: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
  },
  statFooterText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },

  // ==========================================
  // RECOMPENSAS
  // ==========================================
  rewardCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4ADE80',
    padding: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rewardIcon: {
    fontSize: 28,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15803D',
    marginBottom: 2,
  },
  rewardSubtitle: {
    fontSize: 14,
    color: '#15803D',
    opacity: 0.7,
  },
  rewardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ADE80',
    padding: 16,
    marginBottom: 12,
  },
  rewardItemHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  rewardItemIcon: {
    fontSize: 32,
  },
  rewardItemText: {
    flex: 1,
  },
  rewardItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  rewardItemSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  rewardProgressContainer: {
    marginBottom: 12,
  },
  rewardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rewardProgressText: {
    fontSize: 16,
    color: '#475569',
  },
  rewardProgressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16A34A',
  },
  rewardProgressBarContainer: {
    height: 16,
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4ADE80',
    overflow: 'hidden',
  },
  rewardProgressBar: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 999,
  },
  rewardMissing: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803D',
    textAlign: 'center',
    marginTop: 12,
  },
  rewardFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ADE80',
    padding: 12,
  },
  rewardFooterText: {
    fontSize: 14,
    color: '#15803D',
    textAlign: 'center',
  },

  // ==========================================
  // SERVICIOS ACTIVOS
  // ==========================================
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceActive: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  serviceRecycling: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  serviceActiveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // BOTTOM NAVIGATION
  // ==========================================
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  navItemActive: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    color: '#475569',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },

  // ==========================================
  // BOTONES DE PRUEBA
  // ==========================================
  testButtons: {
    position: 'absolute',
    top: 80,
    right: 16,
    gap: 8,
    zIndex: 40,
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  testButtonBlue: {
    backgroundColor: '#2563EB',
  },
  testButtonGreen: {
    backgroundColor: '#10B981',
  },
  testButtonYellow: {
    backgroundColor: '#F59E0B',
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ==========================================
  // NOTIFICATION PANEL (Modal)
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  notificationPanel: {
    width: '85%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  notificationPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationPanelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  notificationCloseButton: {
    padding: 8,
    borderRadius: 999,
  },
  notificationCloseText: {
    fontSize: 20,
    color: '#6B7280',
  },
  notificationList: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  notificationItemUnread: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  notificationItemIcon: {
    fontSize: 24,
  },
  notificationItemContent: {
    flex: 1,
  },
  notificationItemMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  notificationItemTime: {
    fontSize: 14,
    color: '#475569',
  },
  notificationEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  notificationEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notificationEmptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});