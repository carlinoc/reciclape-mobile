import { LinkingOptions } from '@react-navigation/native';

/**
 * Linking Configuration
 * Configuración de deep linking para desarrollo y producción
 * 
 * @path mobile/src/navigation/LinkingConfiguration.ts
 */

export const linking: LinkingOptions<any> = {
  prefixes: [
    'reciclape://',
    'https://reciclape.pe',
    'http://localhost:8081',
    'http://localhost:19006', // Web development
  ],
  config: {
    screens: {
      // ==========================================
      // AUTH STACK
      // ==========================================
      Auth: {
        screens: {
          Onboarding: 'onboarding',
          Login: 'login',
          PhoneConfirmation: {
            path: 'phone-confirmation',
            parse: {
              phoneNumber: (phoneNumber: string) => phoneNumber,
            },
            stringify: {
              phoneNumber: (phoneNumber: string) => phoneNumber,
            },
          },
          Address: 'address',
          Services: 'services',
        },
      },

      // ==========================================
      // NEIGHBOR STACK
      // ==========================================
      Neighbor: {
        screens: {
          // Bottom Tabs
          NeighborTabs: {
            screens: {
              Home: 'home',
              History: 'history',
              Preferences: 'preferences',
            },
          },

          // Modales y pantallas secundarias
          TruckNotification: 'truck-notification',
          TruckArrival: 'truck-arrival',
          RecyclingRegistration: 'recycling-registration',
          Confirmation: 'confirmation',
        },
      },
    },
  },
};

export default linking;