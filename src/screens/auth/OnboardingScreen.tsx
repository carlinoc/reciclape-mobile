import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { styles } from '../../styles/screens/auth/OnboardingScreen.styles';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

/**
 * OnboardingScreen - Pantalla inicial de la aplicación
 * Presenta el valor principal de ReciclaPE y opciones para comenzar
 * 
 * @screen Auth/Onboarding
 * @route /onboarding
 */
const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  
  // ==========================================
  // HANDLERS
  // ==========================================
  
  const handleStartNow = () => {
    // Navegar a LoginScreen
    navigation.navigate('Login');
  };

  const handleExistingUser = () => {
    // Por ahora también va a Login (mismo flujo)
    // En el futuro podrías tener una pantalla diferente para usuarios existentes
    navigation.navigate('ExistingUser');
  };

  // ==========================================
  // RENDER
  // ==========================================
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Contenedor principal */}
      <View style={styles.content}>
        
        {/* ========================================== */}
        {/* 1. ENCABEZADO: Logo pequeño */}
        {/* ========================================== */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>♻️</Text>
            <Text style={styles.logoText}>Recicla.pe</Text>
          </View>
        </View>

        {/* ========================================== */}
        {/* 2. HÉROE: Parte visual y emocional */}
        {/* ========================================== */}
        <View style={styles.heroSection}>
          
          {/* Ilustración con ícono de reciclaje */}
          <View style={styles.iconCircle}>
            <Text style={styles.logoEmoji}>♻️</Text>
          </View>

          {/* Título principal */}
          <Text style={styles.heroTitle}>
            Convierte tu basura{'\n'}
            <Text style={styles.heroTitleHighlight}>en premios</Text>
          </Text>

          {/* Subtítulo */}
          <Text style={styles.heroSubtitle}>
            Recicla correctamente, acumula puntos y canjéalos por descuentos reales.
          </Text>
        </View>

        {/* ========================================== */}
        {/* 3. ZONA DE ACCIÓN: Botones */}
        {/* ========================================== */}
        <View style={styles.actionSection}>
          
          {/* Botón Principal */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartNow}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Empezar ahora</Text>
            <Text style={styles.primaryButtonArrow}>→</Text>
          </TouchableOpacity>

          {/* Botón Secundario */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleExistingUser}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
          </TouchableOpacity>

          {/* Legal */}
          <Text style={styles.legalText}>
            Al continuar, aceptas nuestros{' '}
            <Text style={styles.legalTextLink}>Términos y Condiciones</Text>.
          </Text>
        </View>

        {/* ========================================== */}
        {/* Footer info */}
        {/* ========================================== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Solo necesitas tu celular para empezar 📱
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;