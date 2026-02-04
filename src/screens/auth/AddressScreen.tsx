import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/common/Button';
import Input from '../../components/common/input';
import { styles } from '../../styles/screens/auth/AddressScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { getDistricts, reverseGeocode, District } from '../../../services/api/location.service';
import authService from '../../../services/api/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

type AddressScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Address'>;

// Coordenadas iniciales (Cusco, Perú)
const INITIAL_LAT = -13.5226;
const INITIAL_LNG = -71.9675;

/**
 * AddressScreen - Captura de dirección del usuario
 * Estructura basada en la API real: POST /neighbors
 */
const AddressScreen: React.FC = () => {
  const navigation = useNavigation<AddressScreenNavigationProp>();
  const webViewRef = useRef<any>(null);
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [usingGPS, setUsingGPS] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState<boolean>(false);
  
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: INITIAL_LAT,
    longitude: INITIAL_LNG,
  });
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // HTML para el mapa con Leaflet (OpenStreetMap)
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .custom-marker {
          font-size: 32px;
          text-align: center;
          line-height: 1;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: true,
          attributionControl: false
        }).setView([${INITIAL_LAT}, ${INITIAL_LNG}], 16);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
        
        var houseIcon = L.divIcon({
          className: 'custom-marker',
          html: '🏠',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });
        
        var marker = L.marker([${INITIAL_LAT}, ${INITIAL_LNG}], {
          icon: houseIcon,
          draggable: true
        }).addTo(map);
        
        marker.on('dragend', function(e) {
          var pos = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerDrag',
            latitude: pos.lat,
            longitude: pos.lng
          }));
        });
        
        map.on('click', function(e) {
          marker.setLatLng(e.latlng);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          }));
        });
        
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
        
        function updatePosition(lat, lng) {
          var newLatLng = L.latLng(lat, lng);
          marker.setLatLng(newLatLng);
          map.setView(newLatLng, 17);
        }
        
        function centerMap(lat, lng, zoom) {
          map.setView([lat, lng], zoom || 17);
        }
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    loadDistricts();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateAddressFromCoordinates(markerCoordinate.latitude, markerCoordinate.longitude);
    }, 2000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [markerCoordinate]);

  const loadDistricts = async () => {
    try {
      setLoadingDistricts(true);
      
      const mockDistricts: District[] = [
        { id: '080101', name: 'CUSCO', provinceId: '0801', isActive: true },
        { id: '080501', name: 'San Sebastián', provinceId: '0801', isActive: true },
        { id: '080108', name: 'SANTIAGO', provinceId: '0801', isActive: true },
      ];
      
      setDistricts(mockDistricts);
      
      try {
        const fetchedDistricts = await getDistricts('0801');
        setDistricts(fetchedDistricts);
      } catch (error) {
        console.log('API no disponible, usando datos locales');
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const updateAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const addressText = await reverseGeocode(latitude, longitude);
      setAddress(addressText);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapReady') {
        setMapReady(true);
      } else if (data.type === 'markerDrag' || data.type === 'mapClick') {
        setMarkerCoordinate({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleUseLocation = async () => {
    try {
      if (!Location) {
        Alert.alert(
          'Ubicación no disponible',
          'No es posible acceder al servicio de ubicación en este entorno.'
        );
        return;
      }

      setUsingGPS(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para autocompletar tu dirección.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configuración', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setUsingGPS(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy ? Location.Accuracy.High : undefined,
      });

      const { latitude, longitude } = location.coords;
      
      setMarkerCoordinate({ latitude, longitude });
      
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          updatePosition(${latitude}, ${longitude});
          true;
        `);
      }

      await updateAddressFromCoordinates(latitude, longitude);
      
      Alert.alert('¡Ubicación detectada!', 'Verifica que tu dirección sea correcta');
      
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    } finally {
      setUsingGPS(false);
    }
  };

  const handleConfirmAddress = async () => {
    if (!selectedDistrict) {
      Alert.alert('Distrito requerido', 'Por favor selecciona tu distrito');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Dirección requerida', 'Por favor ingresa tu dirección completa');
      return;
    }

    if (address.trim().length < 10) {
      Alert.alert(
        'Dirección incompleta',
        'Por favor ingresa una dirección más detallada'
      );
      return;
    }

    try {
      setIsRegistering(true);

      const tempDataJson = await AsyncStorage.getItem('tempUserData');
      
      if (!tempDataJson) {
        Alert.alert('Error', 'No se encontraron datos del usuario. Por favor inicia sesión nuevamente.');
        navigation.navigate('Login');
        return;
      }

      const tempData = JSON.parse(tempDataJson);

      // Obtener municipalityId correcto basado en el distrito
      let municipalityId = '';
      let zoneId = '';
      
      if (selectedDistrict === '080501') { // San Sebastián
        municipalityId = '9ae8dab4-d959-4e37-8599-e54531b585bb';
        zoneId = 'b71a095b-1989-4697-b3db-88aa3d45c0bf'; // Zona 1 por defecto
      } else {
        // Para otros distritos, usar valores por defecto o mostrar error
        Alert.alert('Distrito no soportado', 'Por el momento solo operamos en San Sebastián.');
        setIsRegistering(false);
        return;
      }

      // Actualizar datos temporales con dirección y ubicación
      // Separar dirección en componentes según la API
      const addressParts = address.trim().split(',');
      const street = addressParts[0]?.trim() || address.trim();
      const number = ''; // Extraer del address si es necesario
      const apartment = ''; // Extraer del address si es necesario

      const updatedData = {
        ...tempData,
        // Campos requeridos según API /neighbors
        municipalityId: municipalityId,
        zoneId: zoneId,
        districtId: selectedDistrict,
        street: street,
        number: number,
        apartment: apartment,
        latitude: markerCoordinate.latitude,
        longitude: markerCoordinate.longitude,
        isActive: true,
        device: Platform.OS === 'ios' ? 'iOS' : 'Android'
      };

      await AsyncStorage.setItem('tempUserData', JSON.stringify(updatedData));

      console.log('📍 Datos de dirección guardados:', {
        municipalityId,
        zoneId,
        districtId: selectedDistrict
      });

      // Navegar a Services
      navigation.navigate('Services');
      
    } catch (error: any) {
      console.error('Error guardando dirección:', error);
      Alert.alert(
        'Error al guardar dirección',
        error.message || 'No se pudo guardar la dirección. Por favor intenta nuevamente.'
      );
    } finally {
      setIsRegistering(false);
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
              ¿Dónde pasará el camión por ti?
            </Text>
            <Text style={styles.heroSubtitle}>
              Pon la dirección de tu casa para saber cuándo avisarte.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Distrito</Text>
            {loadingDistricts ? (
              <View style={styles.pickerContainer}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={(itemValue) => {
                    if (itemValue === '080501' || itemValue === '') {
                      setSelectedDistrict(itemValue);
                    } else {
                      Alert.alert(
                        'Distrito no disponible',
                        'Por el momento solo operamos en San Sebastián. Pronto estaremos en más distritos.'
                      );
                    }
                  }}
                  style={styles.picker}
                  enabled={!isRegistering}
                >
                  <Picker.Item
                    label="Selecciona tu distrito"
                    value=""
                    color="#9CA3AF"
                  />
                  {districts.map((district) => (
                    <Picker.Item
                      key={district.id}
                      label={district.name}
                      value={district.id}
                      color={district.id === '080501' ? '#111827' : '#D1D5DB'}
                      enabled={district.id === '080501'}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <Input
              label="Escribe tu dirección completa"
              placeholder="Ejemplo: Jr. Los Sauces 123, Dpto. 201"
              value={address}
              onChangeText={setAddress}
              type="text"
              maxLength={150}
            />
            <Text style={styles.addressInputHint}>
              Incluye calle, número y referencia si es necesario
            </Text>
          </View>

          <View style={styles.mapSection}>
            <Text style={styles.mapLabel}>
              Toca el mapa o arrastra 🏠 para marcar tu casa
            </Text>
            
            <View style={styles.mapContainer}>
              {Platform.OS === 'web' || !WebView ? (
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapPlaceholderIcon}>🗺️</Text>
                  <Text style={styles.mapPlaceholderText}>
                    Mapa interactivo (OpenStreetMap)
                  </Text>
                  <Text style={styles.mapPlaceholderSubtext}>
                    (Disponible solo en la app móvil)
                  </Text>
                </View>
              ) : (
                <WebView
                  ref={webViewRef}
                  source={{ html: mapHtml }}
                  style={styles.map}
                  onMessage={handleWebViewMessage}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F3F4F6' }]}>
                      <ActivityIndicator size="large" color="#2563EB" />
                      <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando mapa...</Text>
                    </View>
                  )}
                  scrollEnabled={false}
                  bounces={false}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleUseLocation}
              activeOpacity={0.7}
              disabled={usingGPS || isRegistering}
            >
              <Text style={styles.locationButtonIcon}>
                {usingGPS ? '⏳' : '📍'}
              </Text>
              <Text style={styles.locationButtonText}>
                {usingGPS ? 'Obteniendo ubicación...' : 'Usar mi ubicación'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={handleConfirmAddress} disabled={isRegistering}>
            {isRegistering ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              'Confirmar dirección'
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddressScreen;