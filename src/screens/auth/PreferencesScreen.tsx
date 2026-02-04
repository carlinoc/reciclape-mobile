import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { DevSettings } from 'react-native';
import Button from '../../components/common/Button';
import Switch from '../../components/common/Switch';
import { styles } from '../../styles/screens/auth/PreferencesScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NeighborTabsParamList } from '../../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import authService from '../../../services/api/auth.service';

type PreferencesScreenNavigationProp = BottomTabNavigationProp<NeighborTabsParamList, 'Preferences'>;

const PreferencesScreen: React.FC = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();

  const [userType] = useState<'new' | 'existing'>('existing');
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [userLocation, setUserLocation] = useState('Sin dirección registrada');

  const [garbageEnabled, setGarbageEnabled] = useState(true);
  const [recyclingEnabled, setRecyclingEnabled] = useState(true);
  const [alertTime, setAlertTime] = useState<5 | 10 | 15>(10);

  useEffect(() => {
    loadPreferences();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        setUserName(userData.name || 'Usuario');
        setUserEmail(userData.email || 'sin email');
        setUserId(userData.id || ''); // Obtener ID del usuario
        // TODO: Obtener dirección del endpoint /neighbors/me cuando esté disponible
        setUserLocation('San Sebastian, Cusco'); // Temporal
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('userPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setGarbageEnabled(prefs.garbageEnabled ?? true);
        setRecyclingEnabled(prefs.recyclingEnabled ?? true);
        setAlertTime(prefs.alertTime ?? 10);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  const handleSavePreferences = async () => {
    if (!garbageEnabled && !recyclingEnabled) {
      Alert.alert(
        'Advertencia',
        'Debes activar al menos un servicio de camión para recibir avisos',
        [{ text: 'Entendido' }]
      );
      return;
    }

    const preferences = {
      garbageEnabled,
      recyclingEnabled,
      alertTime,
    };

    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      Alert.alert(
        'Preferencias guardadas',
        'Tus preferencias se han actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Preferencias guardadas:', preferences);
              handleGoBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'No se pudieron guardar las preferencias');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Llamar al logout del authService con el ID del usuario
              await authService.logout(userId);
              
              console.log('✅ Usuario desconectado correctamente');
              
              // OPCIÓN 1: Reload completo de la app (solo para desarrollo)
              if (__DEV__) {
                DevSettings.reload();
                return;
              }
              
              // OPCIÓN 2: Usar RNRestart para producción
              // import RNRestart from 'react-native-restart';
              // RNRestart.Restart();
              
            } catch (error: any) {
              console.error('❌ Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta nuevamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferencias</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.content}>

          {userType === 'existing' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cuenta</Text>
              <View style={styles.accountCard}>
                <View style={styles.accountRow}>
                  <Text style={styles.accountIcon}>👤</Text>
                  <Text style={styles.accountText}>{userName}</Text>
                </View>
                <View style={styles.accountRow}>
                  <Text style={styles.accountIcon}>📧</Text>
                  <Text style={styles.accountTextSecondary}>{userEmail}</Text>
                </View>
                <View style={[styles.accountRow, { marginBottom: 0 }]}>
                  <Text style={styles.accountIcon}>📍</Text>
                  <Text style={styles.accountTextSecondary}>{userLocation}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>¿De qué camión te avisamos?</Text>
            <Switch
              checked={garbageEnabled}
              onChange={setGarbageEnabled}
              label="🗑️ Basura"
            />
            <Switch
              checked={recyclingEnabled}
              onChange={setRecyclingEnabled}
              label="♻️ Reciclaje"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiempo de aviso</Text>
            <View style={styles.timeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  alertTime === 5 && styles.timeButtonActive,
                ]}
                onPress={() => setAlertTime(5)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    alertTime === 5 && styles.timeButtonTextActive,
                  ]}
                >
                  5 min
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timeButton,
                  alertTime === 10 && styles.timeButtonActive,
                ]}
                onPress={() => setAlertTime(10)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    alertTime === 10 && styles.timeButtonTextActive,
                  ]}
                >
                  10 min
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timeButton,
                  alertTime === 15 && styles.timeButtonActive,
                ]}
                onPress={() => setAlertTime(15)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    alertTime === 15 && styles.timeButtonTextActive,
                  ]}
                >
                  15 min
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {userType === 'existing' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cuenta</Text>
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ marginTop: 24 }}>
            <Button onPress={handleSavePreferences}>
              Guardar
            </Button>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreferencesScreen;