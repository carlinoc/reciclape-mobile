import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import Button from '../../components/common/Button';
import { styles } from '../../styles/screens/truck/ConfirmationScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborStackParamList } from '../../types/navigation.types';

type ConfirmationNavigationProp = NativeStackNavigationProp<NeighborStackParamList, 'Confirmation'>;

const ConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmationNavigationProp>();

  const scaleAnim = new Animated.Value(0.5);
  const rotateAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGoHome = () => {
    navigation.navigate('NeighborTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Animated.Text
            style={[
              styles.successIcon,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotate },
                ],
              },
            ]}
          >
            ✅
          </Animated.Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <Text style={styles.title}>
            ¡Gracias! Registramos tu entrega.
          </Text>
          <Text style={styles.subtitle}>
            Puedes ajustar tus avisos en Preferencias
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.buttonContainer, 
            { opacity: fadeAnim }
          ]}
        >
          <Button onPress={handleGoHome}>
            Volver al inicio
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmationScreen;