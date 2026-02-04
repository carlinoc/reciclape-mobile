import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import AuthNavigator from './AuthNavigator';
import NeighborNavigator from './NeighborNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Auth"
    >
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Neighbor" component={NeighborNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;