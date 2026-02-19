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
import { getDistricts, reverseGeocode, District, getMunicipaliTyByDistrict, Municipality } from '../../../services/api/location.service';
import authService from '../../../services/api/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

type AddressScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Address'>;

/**
 * AddressScreen - Captura de dirección del usuario
 * Estructura basada en la API real: POST /neighbors
 */
const AddressScreen: React.FC = () => {
  const navigation = useNavigation<AddressScreenNavigationProp>();  
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [usingGPS, setUsingGPS] = useState<boolean>(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  const [districtLocation, setDistrictLocation] = useState({
    latitude: -13.53195,
    longitude: -71.96746,
  });

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const CUSCO_REGION = {
    latitude: -13.53195,
    longitude: -71.96746,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef<MapView>(null);

  const moveToRegion = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000 // duración en ms
    );
  };

  const SAN_SEBASTIAN_BOUNDS = {
    minLat: -13.555,
    maxLat: -13.505,
    minLng: -71.955,
    maxLng: -71.900,
  };

  const isInsideSanSebastian = (lat: number, lng: number) => {
    return (
      lat >= SAN_SEBASTIAN_BOUNDS.minLat &&
      lat <= SAN_SEBASTIAN_BOUNDS.maxLat &&
      lng >= SAN_SEBASTIAN_BOUNDS.minLng &&
      lng <= SAN_SEBASTIAN_BOUNDS.maxLng
    );
  };

  const handleUseMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación.');
        return;
      }

      setUsingGPS(true);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Validar si está dentro de San Sebastián
      if (selectedDistrict === '080501') {
        if (!isInsideSanSebastian(latitude, longitude)) {
          Alert.alert(
            'Fuera de zona',
            'Tu ubicación no está dentro de San Sebastián.'
          );
          setUsingGPS(false);
          return;
        }
      }

      setLocation({ latitude, longitude });
      moveToRegion(latitude, longitude);

    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    }
    finally {
      setUsingGPS(false);
    }
  };
  
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      setLoadingDistricts(true);

      const fetchedDistricts = await getDistricts('0801');
      setDistricts(fetchedDistricts);

    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadMunicipality = async (districtId: string) => {
    try {
      const res = await getMunicipaliTyByDistrict(districtId);
      if (res.length > 0) {
        const rawData = res[0];
        // 1. Definimos las llaves permitidas (lo que está en tu interfaz)
        const allowedKeys: (keyof Municipality)[] = [
          'id', 'officialName', 'districtId', 'address', 'phone'
        ];
        // 2. Filtramos el objeto automáticamente
        const filtered = allowedKeys.reduce((obj, key) => {
          if (rawData && key in rawData) {
            obj[key] = rawData[key];
          }
          return obj;
        }, {} as Municipality);
        
        setSelectedMunicipality(filtered);
        await AsyncStorage.setItem('selectedMunicipality', JSON.stringify(filtered));
        
      } else {
        setSelectedMunicipality(null);
      }
      
    } catch (error) {
      console.error('Error loading municipality:', error);
    }
  }; 
  
  const handleGoBack = () => {
    navigation.goBack();
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

    if (!location) {
      Alert.alert('Ubicación requerida', 'Por favor marca tu casa en el mapa.');
      return;
    }
    
    if (location.latitude === districtLocation.latitude && location.longitude === districtLocation.longitude) {
      Alert.alert('Ubicación no válida', 'Por favor ubica la dirección exacta de tu casa en el mapa.');
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
            
      const updatedData = {
        ...tempData,
        municipalityId: selectedMunicipality ? selectedMunicipality.id : '',
        districtId: selectedDistrict,
        street: address,
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        device: Platform.OS === 'ios' ? 'iOS' : 'Android'
      };

      await AsyncStorage.setItem('tempUserData', JSON.stringify(updatedData));
      
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
            {loadingDistricts ? (
              <View style={styles.pickerContainer}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={(itemValue) => {
                    if (itemValue === '') {
                      setSelectedDistrict('');
                      return;
                    }
                    
                    const selected = districts.find(d => d.id === itemValue);
                    
                    if (!selected?.isActive) {
                      Alert.alert(
                        'Distrito no disponible',
                        'Por el momento este distrito no está habilitado.'
                      );
                      return;
                    }

                    setSelectedDistrict(itemValue);

                    loadMunicipality(itemValue);
                    
                    // Si el usuario selecciona un distrito, ubicar en su logitud y latitud y agregar marcador en el mapa y que el mapa se desplace a esa ubicación
                    if (selected?.location) {
                      const lat = selected.location.y;
                      const lng = selected.location.x;

                      setDistrictLocation({
                        latitude: lat,
                        longitude: lng,
                      });

                      setLocation({
                        latitude: lat,
                        longitude: lng
                      });

                      moveToRegion(lat, lng);
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
                      color={district.isActive ? '#111827' : '#D1D5DB'}
                      enabled={district.isActive}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.mapSection}>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={CUSCO_REGION}
                onPress={(e) => {
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  setLocation({ latitude, longitude });
                }}
              >
                {location && (
                  <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={(e) => {
                      const { latitude, longitude } = e.nativeEvent.coordinate;
                      setLocation({ latitude, longitude });
                    }}
                  />
                )}
              </MapView>
            </View>
            <View>
                <Text style={styles.titleLocation}>
                  {location
                    ? `Latitud: ${location.latitude.toFixed(5)} | Longitud: ${location.longitude.toFixed(5)}`
                    : 'Toca el mapa para marcar tu ubicación'}
                </Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleUseMyLocation}
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
            
          </View>

          <View style={styles.formSection}>
            <Input
              label="Escribe tu dirección completa"
              placeholder="Ejemplo: Jr. Los Sauces 123"
              value={address}
              onChangeText={setAddress}
              type="text"
              maxLength={150}
              style={{ marginBottom: 2 }}
            />
            <Text style={styles.addressInputHint}>
              Incluye zona, calle y número.
            </Text>
          </View>

          <View style={styles.confirmButton}>
            <Button onPress={handleConfirmAddress} disabled={isRegistering}>
              {isRegistering ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                'Confirmar dirección'
              )}
            </Button>
          </View>      
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddressScreen;