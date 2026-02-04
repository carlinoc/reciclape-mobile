import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/input';
import { styles } from '../../styles/screens/auth/UserDataScreen.styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserDataScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'UserData'>;
type UserDataScreenRouteProp = RouteProp<AuthStackParamList, 'UserData'>;

/**
 * UserDataScreen - Registro completo del usuario
 * SEGÚN NOTAS DE REUNIÓN: "Registro debe tener en la misma pantalla nombre, apellido, email, contraseña, después de haber pedido el número"
 * 
 * ACTUALIZACIÓN: Integra FCM token para notificaciones
 * Recopila: nombre, apellido, DNI, email, contraseña
 * Guarda temporalmente los datos y navega a Address
 */
const UserDataScreen: React.FC = () => {
  const navigation = useNavigation<UserDataScreenNavigationProp>();
  const route = useRoute<UserDataScreenRouteProp>();
  
  // ✅ ACTUALIZADO: Obtener tanto phoneNumber como fcmToken de route params
  const { phoneNumber, fcmToken } = route.params;
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDni = (dni: string): boolean => {
    // DNI debe ser exactamente 8 dígitos numéricos
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { 
        isValid: false, 
        message: 'La contraseña debe tener al menos 8 caracteres' 
      };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return { 
        isValid: false, 
        message: 'Incluye al menos una mayúscula y una minúscula' 
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { 
        isValid: false, 
        message: 'Incluye al menos un número' 
      };
    }

    return { isValid: true };
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    // Validaciones (mantienen la lógica original)
    if (!name.trim()) {
      Alert.alert('Nombre requerido', 'Por favor ingresa tu nombre');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Nombre muy corto', 'Ingresa tu nombre completo');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Apellido requerido', 'Por favor ingresa tu apellido');
      return;
    }

    if (lastName.trim().length < 2) {
      Alert.alert('Apellido muy corto', 'Ingresa tu apellido completo');
      return;
    }

    if (!dni.trim()) {
      Alert.alert('DNI requerido', 'Por favor ingresa tu número de DNI');
      return;
    }

    if (!validateDni(dni.trim())) {
      Alert.alert('DNI inválido', 'El DNI debe tener exactamente 8 números');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Email requerido', 'Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Email inválido', 'Por favor ingresa un email válido');
      return;
    }

    if (!password) {
      Alert.alert('Contraseña requerida', 'Por favor crea una contraseña');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Contraseña insegura', passwordValidation.message || 'Mejora tu contraseña');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Verifica que ambas contraseñas sean iguales');
      return;
    }

    try {
      setIsLoading(true);

      // ✅ ACTUALIZADO: Incluir FCM token en los datos temporales
      const tempUserData = {
        phoneNumber: phoneNumber,
        name: name.trim(),
        lastName: lastName.trim(),
        dni: dni.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        fcmToken: fcmToken || null, // ✅ NUEVO: Incluir FCM token
        // Campos que se completarán después
        municipalityId: null,
        zoneId: null,
        districtId: null,
        street: null,
        number: null,
        apartment: null,
        latitude: null,
        longitude: null,
      };

      await AsyncStorage.setItem('tempUserData', JSON.stringify(tempUserData));

      console.log('✅ Datos de usuario guardados temporalmente');
      console.log('🔔 FCM Token incluido:', fcmToken ? '✅' : '❌');

      // Navegar a Address
      navigation.navigate('Address');

    } catch (error: any) {
      console.error('Error guardando datos:', error);
      Alert.alert(
        'Error',
        'No se pudieron guardar los datos. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NUEVO: Función para llenar datos de prueba en desarrollo
  const fillTestData = () => {
    if (__DEV__) {
      setName('Juan');
      setLastName('Pérez');
      setDni('12345678');
      setEmail('juan.perez@test.com');
      setPassword('Test123456');
      setConfirmPassword('Test123456');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>

          {/* ✅ NUEVO: Botón de datos de prueba para desarrollo */}
          {__DEV__ && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={fillTestData}
            >
              <Text style={{ fontSize: 12, color: '#3B82F6' }}>Test Data</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroIcon}>👤</Text>
            <Text style={styles.heroTitle}>Cuéntanos sobre ti</Text>
            <Text style={styles.heroSubtitle}>
              Necesitamos estos datos para crear tu cuenta y poder avisarte sobre el camión de basura.
            </Text>
          </View>

          <View style={styles.formSection}>
            {/* ✅ ACTUALIZADO: Mostrar estado del teléfono y notificaciones */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📱</Text>
              <Text style={styles.infoText}>
                Tu celular: {phoneNumber}{'\n'}
                {fcmToken ? '🔔 Notificaciones configuradas ✅' : '⚠️ Notificaciones pendientes'}
              </Text>
            </View>

            {/* Nombre */}
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              type="text"
              maxLength={50}
            />

            {/* Apellido */}
            <Input
              label="Apellido"
              placeholder="Tu apellido"
              value={lastName}
              onChangeText={setLastName}
              type="text"
              maxLength={50}
            />

            {/* DNI */}
            <Input
              label="DNI"
              placeholder="12345678"
              value={dni}
              onChangeText={(text) => {
                // Solo permitir números
                const numbers = text.replace(/[^0-9]/g, '');
                setDni(numbers);
              }}
              type="tel"
              maxLength={8}
            />

            {/* Email */}
            <Input
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              type="email"
              maxLength={100}
            />

            {/* Contraseña - usando tipo "text" ya que "password" no está soportado */}
            <Input
              label="Contraseña"
              placeholder="Crea una contraseña segura"
              value={password}
              onChangeText={setPassword}
              type="text"
              maxLength={50}
            />

            {/* Confirmar contraseña */}
            <Input
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              type="text"
              maxLength={50}
            />

            {/* Info sobre contraseña usando infoBox existente */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>🔒</Text>
              <View style={styles.infoText}>
                <Text style={{ fontSize: 14, color: '#1E40AF', fontWeight: '600', marginBottom: 4 }}>
                  Tu contraseña debe tener:
                </Text>
                <Text style={[
                  { fontSize: 13, color: '#1E40AF' },
                  password.length >= 8 && { color: '#065F46' }
                ]}>
                  {password.length >= 8 ? '✅' : '⭕'} Al menos 8 caracteres
                </Text>
                <Text style={[
                  { fontSize: 13, color: '#1E40AF' },
                  /(?=.*[a-z])(?=.*[A-Z])/.test(password) && { color: '#065F46' }
                ]}>
                  {/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? '✅' : '⭕'} Mayúsculas y minúsculas
                </Text>
                <Text style={[
                  { fontSize: 13, color: '#1E40AF' },
                  /(?=.*\d)/.test(password) && { color: '#065F46' }
                ]}>
                  {/(?=.*\d)/.test(password) ? '✅' : '⭕'} Al menos un número
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={handleContinue} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              'Continuar'
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserDataScreen;