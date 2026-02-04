import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import Button from '../../components/common/Button';
import Input from '../../components/common/input';
import { styles } from '../../styles/screens/auth/LoginScreen.styles';
import { useFCM } from '../../hooks/useFCM';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

/**
 * LoginScreen - Primera pantalla del registro
 * Solicita: número de teléfono
 * ACTUALIZADO: Integrado con FCM para notificaciones push reales
 */
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [phone, setPhone] = useState('');
  
  // ✅ NUEVO: Hook para manejar FCM
  const { fcmToken, isLoading: fcmLoading, refreshToken, requestPermissions, hasPermissions } = useFCM();

  useEffect(() => {
    // ✅ NUEVO: Inicializar FCM silenciosamente al cargar la pantalla
    initializeFCMQuietly();
  }, []);

  const initializeFCMQuietly = async () => {
    try {
      console.log('🔄 Inicializando FCM silenciosamente...');
      
      // Solicitar permisos de notificaciones
      const permissionsGranted = await requestPermissions();
      
      if (permissionsGranted) {
        // Obtener token FCM
        await refreshToken();
        console.log('✅ FCM inicializado correctamente');
      } else {
        console.log('⚠️ Permisos de notificación denegados, continuando sin FCM');
      }
    } catch (error) {
      console.log('⚠️ FCM no disponible, continuando normalmente:', error);
    }
  };

  const validatePhone = (phoneNumber: string): { isValid: boolean; message?: string } => {
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[-()]/g, '');

    if (cleanPhone.length === 0) {
      return { isValid: false, message: 'Por favor ingresa tu número de celular' };
    }

    // ✅ MANTENIDO: Tu validación original para números peruanos e internacionales
    
    // Números peruanos (9 dígitos empezando con 9)
    const peruPhoneRegex = /^9\d{8}$/;
    // Números peruanos con código país (+51)
    const peruIntlRegex = /^\+519\d{8}$/;
    // Números internacionales generales
    const intlPhoneRegex = /^\+\d{8,15}$/;
    // Números locales peruanos sin código
    const localPeruRegex = /^9\d{8}$/;

    // Verificar formatos válidos
    if (peruPhoneRegex.test(cleanPhone)) {
      // Número peruano local válido (9 dígitos, empieza con 9)
      return { isValid: true };
    }
    
    if (peruIntlRegex.test(cleanPhone)) {
      // Número peruano internacional válido (+519xxxxxxxx)
      return { isValid: true };
    }
    
    if (intlPhoneRegex.test(cleanPhone)) {
      // Número internacional válido (8-15 dígitos con +)
      if (cleanPhone.length < 10) {
        return { isValid: false, message: 'El número parece muy corto 📱' };
      }
      if (cleanPhone.length > 16) {
        return { isValid: false, message: 'El número parece muy largo 📱' };
      }
      return { isValid: true };
    }

    // Casos de error específicos
    if (cleanPhone.length < 8) {
      return { isValid: false, message: 'El número es muy corto. Usa formato: 987654321 o +51987654321' };
    }

    if (cleanPhone.length > 15 && !cleanPhone.startsWith('+')) {
      return { isValid: false, message: 'El número es muy largo. ¿Incluiste el código país?' };
    }

    // Error general
    return { 
      isValid: false, 
      message: 'Formato inválido. Ejemplos:\n• 987654321 (Perú)\n• +51987654321 (Perú internacional)\n• +1234567890 (Internacional)' 
    };
  };

  const handleContinue = () => {
    const validation = validatePhone(phone);

    if (!validation.isValid) {
      Alert.alert('Número inválido', validation.message || 'Por favor verifica el número');
      return;
    }

    // ✅ MANTENIDO: Tu lógica de normalización original
    let normalizedPhone = phone.replace(/\s/g, '').replace(/[-()]/g, '');
    
    // Si es número peruano sin código país, agregarlo
    if (/^9\d{8}$/.test(normalizedPhone)) {
      normalizedPhone = `+51${normalizedPhone}`;
    }
    
    console.log('📱 Número validado y normalizado:', normalizedPhone);
    console.log('🔔 FCM Token disponible:', fcmToken ? 'SÍ' : 'NO');
    console.log('🔔 Permisos notificaciones:', hasPermissions ? 'OTORGADOS' : 'DENEGADOS');
    
    if (fcmToken) {
      console.log('🔑 FCM Token (primeros 50 chars):', fcmToken.substring(0, 50) + '...');
    }
    
    // ✅ ACTUALIZADO: Navegar a UserData incluyendo FCM token
    navigation.navigate('UserData', { 
      phoneNumber: normalizedPhone,
      fcmToken: fcmToken || undefined // Solo incluir si existe
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatPhoneInput = (text: string) => {
    // ✅ MANTENIDO: Tu lógica de formateo original
    const cleaned = text.replace(/[^\d+\s-()]/g, '');
    
    // Evitar múltiples + 
    if ((cleaned.match(/\+/g) || []).length > 1) {
      return;
    }
    
    // + solo al inicio
    if (cleaned.includes('+') && !cleaned.startsWith('+')) {
      return;
    }
    
    setPhone(cleaned);
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
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>

          {/* ✅ NUEVO: Botón de datos de prueba para desarrollo */}
          {__DEV__ && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 20, top: 20 }}
              onPress={() => {
                if (__DEV__) {
                  setPhone('+51987654321');
                }
              }}
            >
              <Text style={{ fontSize: 12, color: '#3B82F6' }}>Test Data</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.heroIcon}>📱</Text>
            <Text style={styles.heroTitle}>¿Cuál es tu celular?</Text>
            <Text style={styles.heroSubtitle}>
              Lo usaremos para avisarte cuando el camión esté cerca de tu casa.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Número de celular"
              placeholder="987654321 o +51987654321"
              value={phone}
              onChangeText={formatPhoneInput}
              type="tel"
              maxLength={25}
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔒 Solo lo usamos para avisos del camión{'\n'}
                📲 Acepta números peruanos e internacionales{'\n'}
                🇵🇪 Ejemplos: 987654321, +51987654321
              </Text>
            </View>

            {/* ✅ NUEVO: Estado FCM para desarrollo */}
            {__DEV__ && (
              <View style={[styles.infoBox, { backgroundColor: '#F3F4F6', marginTop: 12 }]}>
                <Text style={[styles.infoText, { color: '#374151', fontSize: 12 }]}>
                  🔔 Notificaciones: {hasPermissions ? '✅ Habilitadas' : '⚠️ Sin permisos'}{'\n'}
                  🔑 FCM Token: {fcmToken ? '✅ Obtenido' : (fcmLoading ? '🔄 Cargando...' : '❌ No disponible')}{'\n'}
                  📱 Dispositivo: {Platform.OS === 'android' ? 'Android' : 'iOS'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            onPress={handleContinue}
            disabled={fcmLoading} // Solo deshabilitar si FCM está cargando activamente
          >
            {fcmLoading ? 'Preparando notificaciones...' : 'Continuar'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;