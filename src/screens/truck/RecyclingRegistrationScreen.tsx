import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import Button from '../../components/common/Button';
import { styles } from '../../styles/screens/truck/RecyclingRegistrationScreen.styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborStackParamList } from '../../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RecyclingRegistrationNavigationProp = NativeStackNavigationProp<
  NeighborStackParamList,
  'RecyclingRegistration'
>;

/**
 * RecyclingRegistrationScreen - Escaneo de QR del recolector
 * El usuario abre la cámara y escanea el QR del operario para registrar la entrega
 * 
 * @screen Neighbor/RecyclingRegistration
 * @route /recycling-registration
 */
const RecyclingRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<RecyclingRegistrationNavigationProp>();

  // ==========================================
  // STATE
  // ==========================================
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Datos del usuario (mock data - en producción viene de AsyncStorage)
  const [userName, setUserName] = useState('Usuario');
  const [userId, setUserId] = useState<string | null>(null);
  const [municipalityId, setMunicipalityId] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  // CARGAR DATOS AL ENTRAR A LA PANTALLA
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || 'Usuario');
        setUserId(user.id);
        setMunicipalityId(user.municipalityId || '9ae8dab4-d959-4e37-8599-e54531b585bb'); 
        console.log('✅ Datos de usuario cargados:', { 
          name: user.name, 
          id: user.id,
          municipalityId: user.municipalityId 
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Necesitamos acceso a tu cámara para escanear el código QR del recolector.',
        [
          { text: 'Cancelar', style: 'cancel', onPress: handleGoBack },
          { text: 'Configuración', onPress: () => Camera.requestCameraPermissionsAsync() }
        ]
      );
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenCamera = () => {
    setScanned(false);
    setCameraActive(true);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setCameraActive(false);

    // Validar que el QR sea de un operario/camión
    // TODO: En producción, validar con el backend que el QR es válido
    if (data.startsWith('OPERATOR_') || data.startsWith('TRUCK_')) {
      Alert.alert(
        '¡QR Escaneado!',
        `Se ha registrado tu entrega de reciclaje.\n\nOperario: ${data}`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              // TODO: Llamar al endpoint POST /collections
              // createCollection({ ... })
              navigation.navigate('Confirmation');
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'QR Inválido',
        'Este código QR no pertenece a un recolector autorizado. Por favor, solicita al operario que te muestre su código QR.',
        [
          { text: 'Reintentar', onPress: handleOpenCamera }
        ]
      );
    }
  };

  // ==========================================
  // RENDER - Sin permisos
  // ==========================================

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.content}>
          <Text style={styles.title}>Solicitando permisos de cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
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
          <Text style={styles.headerTitle}>Registrar Reciclaje</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.recyclingIcon}>🚫</Text>
          <Text style={styles.title}>Sin acceso a la cámara</Text>
          <Text style={styles.subtitle}>
            Necesitamos acceso a tu cámara para escanear el código QR del recolector.
          </Text>
          <Button onPress={requestCameraPermission}>
            Solicitar permiso
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER - Cámara activa
  // ==========================================

  if (cameraActive) {
    return (
      <SafeAreaView style={cameraStyles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false}/>
        
        <CameraView
          style={cameraStyles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          {/* Overlay con instrucciones */}
          <View style={cameraStyles.overlay}>
            <View style={cameraStyles.topOverlay}>
              <TouchableOpacity
                style={cameraStyles.closeButton}
                onPress={() => setCameraActive(false)}
                activeOpacity={0.7}
              >
                <Text style={cameraStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={cameraStyles.centerOverlay}>
              <View style={cameraStyles.scanFrame} />
              <Text style={cameraStyles.instructionText}>
                Apunta la cámara al código QR del recolector
              </Text>
            </View>

            <View style={[cameraStyles.bottomOverlay, { paddingBottom: insets.bottom }]}>
              <Text style={cameraStyles.helpText}>
                El código será escaneado automáticamente
              </Text>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER - Pantalla principal (antes de abrir cámara)
  // ==========================================

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Reciclaje</Text>
      </View>

      <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={true}
        >
        {/* CONTENT */}
        <View style={styles.content}>
          
          {/* INSTRUCTIONS */}
          <View style={styles.qrSection}>
            <Text style={styles.recyclingIcon}>📸</Text>
            <Text style={styles.title}>Escanea el QR del recolector</Text>
            <Text style={styles.subtitle}>
              Pídele al operario que te muestre su código QR para registrar tu entrega de reciclaje
            </Text>

            {/* Camera icon placeholder */}
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>
                  📷{'\n\n'}
                  Toca el botón para{'\n'}
                  abrir la cámara
                </Text>
              </View>
            </View>
          </View>

          {/* USER INFO */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👤</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Usuario:</Text> {userName}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>♻️</Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Servicio:</Text> Reciclaje
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <View style={[styles.buttonContainer]}>
            <Button onPress={handleOpenCamera}>
              Abrir cámara y escanear QR
            </Button>
            <Text style={[styles.infoText, { marginTop: 12, fontSize: 12, textAlign: 'center' }]}>
              💡 El operario te mostrará su código QR para confirmar la entrega
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// CAMERA STYLES
// ==========================================

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  centerOverlay: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionText: {
    marginTop: 24,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: '600',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default RecyclingRegistrationScreen;