import { NavigatorScreenParams } from '@react-navigation/native';

// ==========================================
// AUTH STACK (Autenticación / Onboarding)
// ==========================================
export type AuthStackParamList = {
  Onboarding: undefined;
  ExistingUser: undefined;
  Login: undefined;
  PhoneConfirmation: {
    phoneNumber: string;
  };
  UserData: { 
    phoneNumber: string;
    fcmToken?: string;
  };
  Address: undefined;
  Services: undefined;
};

// ==========================================
// NEIGHBOR BOTTOM TABS (Usuario vecino)
// ==========================================
export type NeighborTabsParamList = {
  Home: undefined;
  History: undefined;
  Preferences: undefined;
};

// ==========================================
// NEIGHBOR STACK (Pantallas adicionales/modales)
// ==========================================
export type NeighborStackParamList = {
  NeighborTabs: NavigatorScreenParams<NeighborTabsParamList>;
  TruckNotification: undefined;
  TruckArrival: undefined;
  RecyclingRegistration: undefined;
  Confirmation: undefined;

  RecyclingSubmission: {
    truckId: string;
    userId: string;
    municipalityId: string;
  };
};

// ==========================================
// ROOT NAVIGATOR (Navigator principal)
// ==========================================
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Neighbor: NavigatorScreenParams<NeighborStackParamList>;
};

// ==========================================
// DECLARACIÓN GLOBAL (para useNavigation)
// ==========================================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// ==========================================
// INTERFACES ADICIONALES PARA REGISTRO
// ==========================================
export interface TempUserData {
  phoneNumber: string;
  name: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
  fcmToken?: string;
  municipalityId?: string | null;
  zoneId?: string | null;
  districtId?: string | null;
  street?: string | null;
  number?: string | null;
  apartment?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}