import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { 
  NeighborTabsParamList, 
  NeighborStackParamList 
} from '../types/navigation.types';

// Pantallas principales (tabs)
import HomeScreen from '../screens/neighbor/HomeScreen';
import HistoryScreen from '../screens/neighbor/HistoryScreen';
import PreferencesScreen from '../screens/auth/PreferencesScreen'

// Pantallas secundarias (stack)
import TruckNotificationScreen from '../screens/truck/TruckNotificationScreen';
import TruckArrivalScreen from '../screens/truck/TruckArrivalScreen';
import RecyclingRegistrationScreen from '../screens/truck/RecyclingRegistrationScreen';
import ConfirmationScreen from '../screens/truck/ConfirmationScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RecyclingSubmissionScreen from '../screens/truck/RecyclingSubmissionScreen';

/**
 * NeighborNavigator - Navegación principal del vecino
 * Incluye Bottom Tabs y Stack para pantallas modales
 * 
 * @path mobile/src/navigation/NeighborNavigator.tsx
 */

const Tab = createBottomTabNavigator<NeighborTabsParamList>();
const Stack = createNativeStackNavigator<NeighborStackParamList>();

// ==========================================
// BOTTOM TABS
// ==========================================
const NeighborTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 60 + insets.bottom,  
          paddingTop: 8,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>📜</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Preferences" 
        component={PreferencesScreen}
        options={{
          tabBarLabel: 'Preferencias',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ==========================================
// STACK PRINCIPAL (con tabs + modales)
// ==========================================
const NeighborNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* Bottom Tabs como pantalla principal */}
      <Stack.Screen 
        name="NeighborTabs" 
        component={NeighborTabs}
      />
      
      {/* Pantallas modales/secundarias */}
      <Stack.Screen 
        name="TruckNotification" 
        component={TruckNotificationScreen}
        options={{
          animation: 'fade',
          presentation: 'transparentModal',
        }}
      />
      
      <Stack.Screen 
        name="TruckArrival" 
        component={TruckArrivalScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="RecyclingRegistration" 
        component={RecyclingRegistrationScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen 
        name="RecyclingSubmission" 
        component={RecyclingSubmissionScreen}
        options={{ 
          title: 'Registrar Reciclaje',
          headerShown: true,
          animation: 'slide_from_right'
        }}
      />
      
      <Stack.Screen 
        name="Confirmation" 
        component={ConfirmationScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default NeighborNavigator;