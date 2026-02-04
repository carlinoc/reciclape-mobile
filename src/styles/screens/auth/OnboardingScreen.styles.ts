import { StyleSheet } from 'react-native';

/**
 * Estilos para OnboardingScreen
 * @styles Auth/Onboarding
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },

  // ==========================================
  // 1. HEADER
  // ==========================================
  header: {
    paddingTop: 16,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.8,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // gray-700
    letterSpacing: -0.5,
  },

  // ==========================================
  // 2. HERO SECTION
  // ==========================================
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  iconCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#F0FDF4', // green-50
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Para Android
  },
  recycleIcon: {
    width: 112,
    height: 112,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827', // gray-900
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: '#4CAF50', // green-500
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280', // gray-500
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
    paddingHorizontal: 16,
  },

  // ==========================================
  // 3. ACTION SECTION
  // ==========================================
  actionSection: {
    gap: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563EB', // blue-600
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6, // Para Android
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  legalText: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  legalTextLink: {
    textDecorationLine: 'underline',
    color: '#9CA3AF',
  },

  // ==========================================
  // 4. FOOTER
  // ==========================================
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});