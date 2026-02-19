import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Button from '../../components/common/Button';
import Switch from '../../components/common/Switch';
import { styles } from '../../styles/screens/auth/ServicesScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../../services/api/auth.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';

type ServicesScreenNavigationProp =  NativeStackNavigationProp<AuthStackParamList & RootStackParamList, 'Services'>;

/**
 * ServicesScreen - Selección de servicios y finalización del registro
 */
const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  
  // Camión de basura habilitado por defecto, reciclaje DESHABILITADO para v1
  const [garbageEnabled, setGarbageEnabled] = useState<boolean>(true);
  const [recyclingEnabled, setRecyclingEnabled] = useState<boolean>(false);
  const [alertTime, setAlertTime] = useState<5 | 10 | 15>(5);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [municipalityName, setMunicipalityName] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const loadMunicipalityFromStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedMunicipality');
        
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          setMunicipalityName(parsed.officialName);
        }
      } catch (error) {
        console.error('Error loading municipality from storage:', error);
      }
    };

    loadMunicipalityFromStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // IMPORTANTE: Camión de reciclaje DESHABILITADO para v1 según notas
  const handleRecyclingToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Próximamente',
        'El servicio de camión de reciclaje estará disponible muy pronto.',
        [{ text: 'Entendido' }]
      );
      return;
    }
    setRecyclingEnabled(false);
  };

  const handleFinishRegistration = async () => {
    // Validar que al menos el camión de basura esté habilitado
    if (!garbageEnabled) {
      Alert.alert(
        'Selecciona el servicio de basura',
        'Necesitas activar el camión de basura para continuar',
        [{ text: 'Entendido' }]
      );
      return;
    }

    try {
      setIsRegistering(true);

      // Obtener todos los datos guardados temporalmente
      const tempDataJson = await AsyncStorage.getItem('tempUserData');
      
      if (!tempDataJson) {
        Alert.alert('Error', 'No se encontraron datos. Por favor vuelve a empezar.');
        navigation.navigate('Login');
        return;
      }

      const tempData = JSON.parse(tempDataJson);
           
      // Estructura exacta según API POST /neighbors - CORREGIDA
      const neighborData = {
        name: tempData.name,
        lastName: tempData.lastName,
        email: tempData.email,
        password: tempData.password,
        municipalityId: tempData.municipalityId, // Usar ID correcto de San Sebastián
        districtId: tempData.districtId,
        phone: tempData.phoneNumber, // phoneNumber -> phone según API
        dni: tempData.dni, // Usar DNI ingresado por el usuario
        street: tempData.street || 'Sin especificar',
        latitude: tempData.latitude,
        longitude: tempData.longitude,
        fcmToken: tempData.fcmToken || '', // Agregar token FCM si está disponible
        device: Platform.OS === 'ios' ? 'iOS' : 'Android',
        notifyBefore: alertTime,
      };

      // Registrar vecino en la API
      const registerResponse = await authService.registerNeighbor(neighborData);
      console.log('✅ Usuario registrado:', registerResponse);

      // Guardar preferencias de servicios
      const preferences = {
        garbageEnabled,
        recyclingEnabled: false, // Forzar false para v1
        alertTime,
      };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));

      // Limpiar datos temporales
      await AsyncStorage.removeItem('tempUserData');

      // Intentar hacer login automático
      try {
        const loginResponse = await authService.login({
          email: tempData.email,
          password: tempData.password,
          fcmToken: tempData.fcmToken || '',
        });

        console.log('✅ Login automático exitoso:', loginResponse.user.name);

        // Guardar datos del usuario incluyendo el ID
        const userData = {
          id: loginResponse.user.id,
          name: loginResponse.user.name,
          email: loginResponse.user.email,
          municipalityId: loginResponse.user.municipalityId,
          isActive : loginResponse.user.isActive,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        // Marcar onboarding como completado
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Neighbor' }],
        });

      } catch (loginError: any) {
        console.log('⚠️ Login automático falló:', loginError.message);
        
        Alert.alert(
          '¡Registro exitoso!',
          'Tu cuenta ha sido creada. Ahora inicia sesión con tu email y contraseña.',
          [
            {
              text: 'Iniciar sesión',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'ExistingUser' }],
                });
              },
            },
          ]
        );
      }

    } catch (error: any) {
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      let errorMessage = 'No se pudo completar el registro. Intenta nuevamente.';

      if (status === 409) {
        if (backendMessage?.toLowerCase().includes('email')) {
          errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
        } else if (backendMessage?.toLowerCase().includes('phone')) {
          errorMessage = 'Este número de teléfono ya está registrado.';
        } else if (backendMessage?.toLowerCase().includes('dni')) {
          errorMessage = 'Este DNI ya está registrado.';  
        } else {
          errorMessage = backendMessage || 'El usuario ya existe.';
        }
      }

      Alert.alert('Error al registrar', errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
          disabled={isRegistering}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            ¿De qué camiones quieres aviso?
          </Text>
        </View>

        <View style={styles.servicesSection}>
          {/* Camión de basura - HABILITADO */}
          <Switch
            checked={garbageEnabled}
            onChange={setGarbageEnabled}
            label="🚛 Avisarme del camión de basura"
          />
          
          {/* Camión de reciclaje - DESHABILITADO para v1 según notas */}
          <View style={{ opacity: 0.4 }}>
            <Switch
              checked={false} // Siempre false para v1
              onChange={handleRecyclingToggle}
              label="♻️ Camión de reciclaje (próximamente)"
            />
          </View>
          
          {/* Mensaje informativo para v1 */}
          <View style={{
            backgroundColor: '#F3F4F6',
            padding: 12,
            borderRadius: 8,
            marginTop: 10,
          }}>
            <Text style={{ fontSize: 13, color: '#6B7280'}}>
              Por ahora solo disponemos del camión de basura
            </Text>
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>
            ¿Con cuánta anticipación te avisamos?
          </Text>
          
          <View style={styles.timeButtons}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                alertTime === 5 && styles.timeButtonActive,
              ]}
              onPress={() => setAlertTime(5)}
              activeOpacity={0.7}
              disabled={isRegistering}
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
              disabled={isRegistering}
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
              disabled={isRegistering}
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

        {/* Info box */}
        <View style={styles.notifyConte}>
          <Text style={styles.notifyConteText}>
            💡 Recibirás una notificación cuando el camión esté a {alertTime} minutos de tu casa.
          </Text>
        </View>

        <View style={styles.infoEntity}>
          <Text style={styles.infoSectionTitle}>
            Entidad responsable:
          </Text>
          <View style={styles.infoEntityContent}>
            <Text style={styles.infoEntityText}>
             🏢 {municipalityName || 'Municipalidad'}
            </Text>
          </View>
        </View>

        <View style={styles.confirmButton}>
          <Button onPress={handleFinishRegistration} disabled={isRegistering}>
            {isRegistering ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              'Crear mi cuenta'
            )}
          </Button>
        </View>   

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ExistingUser')} 
            disabled={isRegistering}
          >
            <Text style={{ color: '#3B82F6', textAlign: 'center' }}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;