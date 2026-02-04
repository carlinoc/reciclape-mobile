import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation.types';

// Pantallas de autenticación
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import ExistingUserScreen from '../screens/auth/ExistingUserScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import AddressScreen from '../screens/auth/AddressScreen';
import ServicesScreen from '../screens/auth/ServicesScreen';
import UserDataScreen from '../screens/auth/UserDataScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
      initialRouteName="Onboarding"
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          animation: 'fade',
        }}
      />

      <Stack.Screen 
        name="ExistingUser" 
        component={ExistingUserScreen}
        options={{
          animation: 'fade',
        }}
      />
      
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
      />
      
      <Stack.Screen 
        name="Address" 
        component={AddressScreen}
      />
      
      <Stack.Screen 
        name="Services" 
        component={ServicesScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen 
        name="UserData" 
        component={UserDataScreen}
        options={{
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;