import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
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

type ServicesScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;

/**
 * ServicesScreen - Selección de servicios y finalización del registro
 * IMPORTANTE: Camión de reciclaje DESHABILITADO para v1 según notas de reunión
 * Estructura de registro basada en API real: POST /neighbors
 */
const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  
  // Camión de basura habilitado por defecto, reciclaje DESHABILITADO para v1
  const [garbageEnabled, setGarbageEnabled] = useState<boolean>(true);
  const [recyclingEnabled, setRecyclingEnabled] = useState<boolean>(false);
  const [alertTime, setAlertTime] = useState<5 | 10 | 15>(5);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // IMPORTANTE: Camión de reciclaje DESHABILITADO para v1 según notas
  const handleRecyclingToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Próximamente',
        'El servicio de camión de reciclaje estará disponible muy pronto. ¡Mantente atento!',
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

      console.log('📤 Registrando usuario con estructura API...');

      // FCM Token es OPCIONAL en registro según notas de reunión
      let fcmToken: string | undefined = undefined;
      
      try {
        // TODO: Implementar cuando Firebase esté configurado
        console.log('⚠️ FCM Token no disponible (Firebase no configurado)');
        console.log('📝 Nota: FCM Token es opcional en registro según requerimientos');
      } catch (fcmError) {
        console.log('FCM no disponible:', fcmError);
      }

      // Estructura exacta según API POST /neighbors - CORREGIDA
      const neighborData = {
        name: tempData.name,
        lastName: tempData.lastName,
        email: tempData.email,
        password: tempData.password,
        // ✅ FIX: Usar los IDs correctos guardados en AddressScreen
        municipalityId: tempData.municipalityId, // Usar ID correcto de San Sebastián
        zoneId: tempData.zoneId, // Usar zona correcta
        districtId: tempData.districtId,
        phone: tempData.phoneNumber, // phoneNumber -> phone según API
        dni: tempData.dni, // Usar DNI ingresado por el usuario
        street: tempData.street || 'Sin especificar',
        // ✅ FIX: number debe ser string, no null
        number: tempData.number || '', // String vacío en lugar de null
        apartment: tempData.apartment || '', // String vacío en lugar de null
        latitude: tempData.latitude,
        longitude: tempData.longitude,
        isActive: true,
        fcmToken: fcmToken, // Opcional según notas
        device: Platform.OS === 'ios' ? 'iOS' : 'Android',
      };

      console.log('📤 Datos enviados a API:', neighborData);

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
          fcmToken: fcmToken, // Opcional según notas
        });

        console.log('✅ Login automático exitoso:', loginResponse.user.name);

        // Guardar datos del usuario incluyendo el ID
        const userData = {
          id: loginResponse.user.id,
          name: loginResponse.user.name,
          email: loginResponse.user.email,
          // Agregar otros campos según la respuesta del login
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
      console.error('❌ Error en registro:', error.message);
      
      // Mostrar mensaje de error específico
      let errorMessage = 'No se pudo completar el registro. Intenta nuevamente.';
      
      if (error.message.includes('email')) {
        errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
      } else if (error.message.includes('phone')) {
        errorMessage = 'Este número de teléfono ya está registrado.';
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
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            ¿De qué camiones quieres aviso?
          </Text>
          <Text style={styles.heroSubtitle}>
            Por ahora solo disponemos del camión de basura
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
            marginTop: 12,
          }}>
            <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
              📍 Primera versión: Solo camión de basura disponible{'\n'}
              ♻️ El reciclaje llegará en futuras actualizaciones
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
        <View style={{
          backgroundColor: '#EFF6FF',
          padding: 16,
          borderRadius: 12,
          marginTop: 24,
          marginHorizontal: 4,
        }}>
          <Text style={{ fontSize: 14, color: '#1E40AF', lineHeight: 20 }}>
            💡 Recibirás una notificación cuando el camión esté a {alertTime} minutos de tu casa.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleFinishRegistration} disabled={isRegistering}>
          {isRegistering ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            'Crear mi cuenta'
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ServicesScreen;