import { StyleSheet } from 'react-native';

/**
 * Estilos para AddressScreen
 * Pantalla de captura de dirección del usuario
 * 
 * @path mobile/src/styles/screens/auth/AddressScreen.styles.ts
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
  // KEYBOARD AVOIDING VIEW
  // ==========================================
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
  },

  // ==========================================
  // HERO SECTION
  // ==========================================
  heroSection: {
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },

  // ==========================================
  // FORM SECTION
  // ==========================================
  formSection: {
    marginBottom: 0,
  },  
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },

  // ==========================================
  // DISTRICT PICKER
  // ==========================================
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    minHeight: 56,
  },
  picker: {
    height: 56,
    paddingHorizontal: 16,
    color: '#111827',
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: '#9CA3AF',
  },

  // ==========================================
  // ADDRESS INPUT
  // ==========================================
  addressInput: {
    marginBottom: 16,
  },
  addressInputHint: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  titleLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },

  // ==========================================
  // MAP SECTION
  // ==========================================
  mapSection: {
    marginTop: 0,
    marginBottom: 0,
  },
  mapLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  mapPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
  },

  // ==========================================
  // MAPBOX STYLES
  // ==========================================
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    fontSize: 32,
  },

  // ==========================================
  // LOCATION BUTTON
  // ==========================================
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  locationButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },

  confirmButton: {
    marginTop: 16,
    marginBottom: 50,
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