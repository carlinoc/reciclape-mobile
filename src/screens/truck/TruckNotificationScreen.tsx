import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { styles } from '../../styles/screens/truck/TruckNotificationScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborStackParamList } from '../../types/navigation.types';

type TruckNotificationNavigationProp = NativeStackNavigationProp<NeighborStackParamList, 'TruckNotification'>;

/**
 * TruckNotificationScreen - Notificación de camión cercano
 * Pantalla minimalista que alerta al usuario que el camión está a ~5 minutos
 * 
 * @screen Neighbor/TruckNotification
 * @route /truck-notification
 */
const TruckNotificationScreen: React.FC = () => {

  const navigation = useNavigation<TruckNotificationNavigationProp>();

  // ==========================================
  // ANIMACIONES
  // ==========================================
  const scaleAnim = new Animated.Value(0.9);
  const pulseAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de entrada (escala)
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Animación de pulso en la sombra (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación del camión (deslizamiento)
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleNavigateToArrival = () => {
    // TODO: Navegar a TruckArrivalScreen
    console.log('Navegar a TruckArrivalScreen');
    navigation.navigate('TruckArrival');
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: '100%',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNavigateToArrival}
        >
          <Animated.View
            style={[
              styles.notificationCard,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.notificationContent}>
              <View style={styles.notificationLeft}>
                <Animated.Text
                  style={[
                    styles.notificationIcon,
                    { transform: [{ translateX: slideAnim }] },
                  ]}
                >
                  🚛
                </Animated.Text>
                <Text style={styles.notificationText}>
                  El camión está a ~5 min.
                </Text>
              </View>

              <Animated.Text
                style={[
                  styles.notificationArrow,
                  {
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 5],
                          outputRange: [0, 5],
                        }),
                      },
                    ],
                  },
                ]}
              >
                →
              </Animated.Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TruckNotificationScreen;