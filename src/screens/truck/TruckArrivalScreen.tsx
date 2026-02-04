import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import Button from '../../components/common/Button';
import { styles } from '../../styles/screens/truck/TruckArrivalScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborStackParamList } from '../../types/navigation.types';

type TruckArrivalNavigationProp = NativeStackNavigationProp<NeighborStackParamList, 'TruckArrival'>;

/**
 * TruckArrivalScreen - Camión llegó al punto
 * Pantalla con opciones de acción cuando el camión está presente
 * 
 * @screen Neighbor/TruckArrival
 * @route /truck-arrival
 */
const TruckArrivalScreen: React.FC = () => {

  const navigation = useNavigation<TruckArrivalNavigationProp>();

  // ==========================================
  // ANIMACIONES
  // ==========================================
  const scaleAnim = new Animated.Value(0.8);
  const shakeAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de entrada (escala del header)
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Animación de shake del camión
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in de botones
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Interpolación para shake
  const shakeInterpolation = shakeAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [0, -10, 10, -10, 10, 0],
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDelivered = () => {
    // TODO: Navegar a pantalla de confirmación
    Alert.alert(
      '¡Perfecto!',
      'Has ganado 50 puntos por sacar tu basura a tiempo 🎉',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Navegar a HomeScreen con confirmación');
          },
        },
      ]
    );
    navigation.navigate('Confirmation');
  };

  const handleNoTrash = () => {
    // TODO: Navegar a HomeScreen
    console.log('Navegar a HomeScreen');
    navigation.navigate('NeighborTabs', { screen: 'Home' });
  };

  const handleRecycling = () => {
    // TODO: Navegar a pantalla de QR o registro de reciclaje
    console.log('Navegar a QR/Recycling Screen');
    navigation.navigate('RecyclingRegistration');
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.content}>
        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}
        <Animated.View
          style={[
            styles.header,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Animated.Text
            style={[
              styles.truckIcon,
              { transform: [{ translateX: shakeInterpolation }] },
            ]}
          >
            🚛
          </Animated.Text>
          <Text style={styles.title}>El camión llegó a tu punto</Text>
          <Text style={styles.subtitle}>¿Dejaste tu bolsa?</Text>
        </Animated.View>

        {/* ========================================== */}
        {/* BOTONES DE ACCIÓN */}
        {/* ========================================== */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            { opacity: fadeAnim },
          ]}
        >
          {/* Botón primario: Ya dejé mi bolsa */}
          <Button onPress={handleDelivered}>
            Ya dejé mi bolsa
          </Button>

          {/* Botón secundario: No tengo basura → HomeScreen */}
          <Button variant="secondary" onPress={handleNoTrash}>
            Hoy no tengo basura
          </Button>

          {/* Botón terciario: Registrar reciclaje */}
          <Button variant="secondary" onPress={handleRecycling}>
            Registrar mi reciclaje ♻️
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default TruckArrivalScreen;