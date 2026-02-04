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
import PasswordInput from '../../components/common/Passwordinput';
import { styles } from '../../styles/screens/auth/ExistingUserScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../types/navigation.types';
import authService from '../../../services/api/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ExistingUserNavigationProp = NativeStackNavigationProp<AuthStackParamList & RootStackParamList, 'ExistingUser'>;

/**
 * ExistingUserScreen - Login para usuarios existentes
 * ACTUALIZACIÓN: Campo de contraseña oculto con ojo para mostrar/ocultar
 */
const ExistingUserScreen: React.FC = () => {
  const navigation = useNavigation<ExistingUserNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    // Validaciones
    if (!email.trim()) {
      Alert.alert('Email requerido', 'Por favor ingresa tu email');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Email inválido', 'Por favor ingresa un email válido');
      return;
    }

    if (!password) {
      Alert.alert('Contraseña requerida', 'Por favor ingresa tu contraseña');
      return;
    }

    try {
      setIsLoading(true);

      // FCM Token opcional
      let fcmToken: string | undefined = undefined;
      
      try {
        console.log('⚠️ FCM Token no disponible (Firebase no configurado)');
      } catch (fcmError) {
        console.log('FCM no disponible:', fcmError);
      }

      // Realizar login
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password: password,
        fcmToken: fcmToken,
      });

      console.log('✅ Login exitoso:', response.user.name);

      // Guardar datos de usuario para HomeScreen
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Neighbor' }],
      });

    } catch (error: any) {
      console.error('❌ Error en login:', error.message);
      Alert.alert(
        'Error al iniciar sesión',
        error.message || 'Verifica tu email y contraseña'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Por favor contacta a soporte para recuperar tu contraseña.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>👋</Text>
            </View>
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>
              Ingresa con tu email y contraseña para continuar
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email */}
            <Input
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              type="email"
              maxLength={100}
            />

            {/* ✅ Contraseña con componente reutilizable */}
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionContainer}>
            <Button onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                'Iniciar sesión'
              )}
            </Button>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoBack}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>
                ← Volver al inicio
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ExistingUserScreen;