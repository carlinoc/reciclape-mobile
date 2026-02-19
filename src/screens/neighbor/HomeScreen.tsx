import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Button from '../../components/common/Button';
import { styles } from '../../styles/screens/neighbor/HomeScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborTabsParamList, NeighborStackParamList } from '../../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';

// NUEVOS IMPORTS
import historyService from '../../../services/api/history.service';
import pointsService from '../../../services/api/points.service';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<NeighborTabsParamList, 'Home'>,
  NativeStackNavigationProp<NeighborStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // DATOS DEL USUARIO
  const [userName, setUserName] = useState('Usuario');
  const [userId, setUserId] = useState<string | null>(null);
  const [municipalityId, setMunicipalityId] = useState<string | null>(null);
  const [userLocation] = useState('San Sebastián');
  
  // ESTADO DE PUNTOS Y ACTIVIDADES
  const [userPoints, setUserPoints] = useState(0);
  const [hasActivityToday, setHasActivityToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [monthProgress, setMonthProgress] = useState({ current: 0, total: 30 });
  
  // CONFIGURACIÓN Y PREFERENCIAS
  const [garbageEnabled, setGarbageEnabled] = useState(true);
  const [alertTime, setAlertTime] = useState(5);
  
  // ESTADO DEL FLUJO QR
  const [hasScannedQR, setHasScannedQR] = useState(false);
  const [isProcessingCollection, setIsProcessingCollection] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Salir de la aplicación',
          '¿Estás seguro que quieres salir?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  // CARGAR DATOS AL ENTRAR A LA PANTALLA
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      loadHomeScreenData();
      loadPreferences();
    }, [])
  );

  // CARGAR DATOS BÁSICOS DEL USUARIO
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

  // CARGAR DATOS DEL HOME DESDE EL SERVICIO
  const loadHomeScreenData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const homeData = await historyService.getHomeScreenData(user.id);
        
        setUserPoints(homeData.totalPoints);
        setHasActivityToday(homeData.hasActivityToday);
        setCurrentStreak(homeData.currentStreak);
        setMonthProgress(homeData.monthProgress);
        
        console.log('✅ Datos del home cargados:', homeData);
      }
    } catch (error) {
      console.error('Error loading home screen data:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('userPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setGarbageEnabled(prefs.garbageEnabled ?? true);
        setAlertTime(prefs.alertTime ?? 5);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // 🚀 FLUJO DE ESCANEO QR
  const handleScanQR = () => {
    Alert.alert(
      '📱 Escanear QR del recolector',
      'Para ganar puntos, primero debes escanear el código QR que tiene el recolector de basura.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Abrir escáner',
          onPress: () => {
            navigation.navigate('RecyclingRegistration');
          }
        }
      ]
    );
  };

  // FLUJO DE REGISTRO DE COLECCIÓN (BASURA)
  const handleMarkBag = async () => {
    if (!hasScannedQR) {
      Alert.alert(
        '⚠️ QR requerido',
        'Primero debes escanear el código QR del recolector para poder ganar puntos.',
        [
          { text: 'Entendido' },
          { text: 'Escanear QR', onPress: handleScanQR }
        ]
      );
      return;
    }

    if (!userId || !municipalityId) {
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
      return;
    }

    setIsProcessingCollection(true);

    try {
      const result = await historyService.registerCollection({
        userId: userId,
        truckId: undefined,
        operatorUserId: undefined,
        activityType: 'basura',
        pointsToAward: 50,
        municipalityId: municipalityId,
      });

      if (result.success) {
        setUserPoints(prevPoints => prevPoints + result.data.pointsAwarded);
        setHasActivityToday(true);
        setHasScannedQR(false); 
        
        await loadHomeScreenData();
        
        Alert.alert(
          '¡Perfecto! 🎉', 
          `Has ganado ${result.data.pointsAwarded} puntos por sacar tu basura a tiempo.`,
          [
            { text: 'Ver historial', onPress: () => navigation.navigate('History') },
            { text: 'Continuar' }
          ]
        );
      }
    } catch (error: any) {
      console.error('❌ Error registrando colección:', error);
      Alert.alert('Error al registrar', error.message || 'No se pudo registrar.');
    } finally {
      setIsProcessingCollection(false);
    }
  };

  const handleTruckSimulation = () => {
    Alert.alert('🚛 Camión', 'El camión está cerca de tu zona');
    navigation.navigate('TruckNotification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Hola, {userName} 👋</Text>
              <Text style={styles.location}>{userLocation}</Text>
            </View>
          </View>

          <View style={styles.pointsCard}>
            <Text style={styles.pointsIcon}>⭐</Text>
            <View style={styles.pointsContent}>
              <Text style={styles.pointsLabel}>Tu puntaje total</Text>
              <Text style={styles.pointsValue}>{userPoints} pts</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {garbageEnabled ? (
            !hasActivityToday ? (
              <View style={styles.truckCard}>
                <View style={styles.truckCardHeader}>
                  <Text style={styles.truckIcon}>🚛</Text>
                  <View style={styles.truckCardHeaderText}>
                    <Text style={styles.truckCardTitle}>¿A qué hora pasa el camión?</Text>
                    <Text style={styles.truckCardSubtitle}>Basura</Text>
                  </View>
                </View>

                <View style={styles.truckTimeCard}>
                  <View>
                    <Text style={styles.truckTimeLabel}>Llega aproximadamente:</Text>
                    <Text style={styles.truckTime}>12:25 PM</Text>
                  </View>
                  <View style={styles.truckTimeRight}>
                    <Text style={styles.truckClockIcon}>🕒</Text>
                    <Text style={styles.truckEta}>En {alertTime} min</Text>
                  </View>
                </View>

                <Text style={styles.truckInstructions}>
                  {hasScannedQR 
                    ? 'QR escaneado ✅ Ahora puedes confirmar que sacaste tu basura 👇'
                    : 'Cuando llegue el camión, escanea el QR del recolector y luego marca aquí 👇'
                  }
                </Text>

                {hasScannedQR ? (
                  <Button 
                    onPress={handleMarkBag}
                    disabled={isProcessingCollection}
                  >
                    {isProcessingCollection ? '⏳ Registrando...' : '✓ Ya saqué mi basura'}
                  </Button>
                ) : (
                  <View>
                    <Button onPress={handleScanQR}>
                      📱 Escanear QR del recolector
                    </Button>
                    <TouchableOpacity 
                      onPress={() => Alert.alert('QR requerido', 'Primero escanea el QR del recolector')}
                      style={{ 
                        opacity: 0.5, 
                        marginTop: 8, 
                        padding: 12, 
                        backgroundColor: '#F3F4F6', 
                        borderRadius: 8 
                      }}
                      disabled={true}
                    >
                      <Text style={{ textAlign: 'center', color: '#9CA3AF' }}>
                        ✓ Ya saqué mi basura (requiere QR)
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.successCard}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>¡Perfecto! Sacaste tu basura a tiempo</Text>
                <View style={styles.successBadge}>
                  <Text style={styles.successBadgeText}>+50 puntos ganados</Text>
                </View>
                <Text style={styles.successMessage}>
                  Llevas {currentStreak} día{currentStreak !== 1 ? 's' : ''} seguido{currentStreak !== 1 ? 's' : ''} haciéndolo bien 💪
                </Text>
              </View>
            )
          ) : null}

          <View style={styles.statsContainer}>
            {/* 🚀 SECCIÓN DE RECICLAJE REACTIVADA */}
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => {
                if (!userId) {
                  Alert.alert('Error', 'No se encontró el ID de usuario');
                  return;
                }
                // Navegamos a la pantalla intermedia pasando los params que espera
                navigation.navigate('RecyclingSubmission', {
                  userId: userId,
                  municipalityId: municipalityId || '9ae8dab4-d959-4e37-8599-e54531b585bb',
                  truckId: '7557e17d-00fd-412b-b95c-2ec47f1830c8' // ID de camión simulado
                });
              }}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>♻️</Text>
                <View>
                  <Text style={styles.statTitle}>Reciclaje</Text>
                  <Text style={styles.statSubtitle}>Ingresar materiales</Text>
                </View>
              </View>

              <View style={styles.statContent}>
                <View style={styles.statValueContainer}>
                  <Text style={styles.statValueLarge}>+</Text>
                  <Text style={styles.statValueLabel}>Registrar peso</Text>
                </View>
                <Text style={styles.statEmoji}>📦</Text>
              </View>

              <View style={styles.statFooterHighlight}>
                <Text style={[styles.statFooterText, { color: '#059669', fontWeight: '600' }]}>
                  Toca para pesar y ganar puntos →
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>🚛</Text>
                <View>
                  <Text style={styles.statTitle}>Progreso del Mes</Text>
                  <Text style={styles.statSubtitle}>Visitas a tiempo</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    {monthProgress.current} de {monthProgress.total} visitas
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((monthProgress.current / monthProgress.total) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(monthProgress.current / monthProgress.total) * 100}%` }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.statFooterHighlight}>
                <Text style={styles.statFooterText}>
                  {monthProgress.current > 0 
                    ? '¡Muy bien! Estás cumpliendo con tu barrio 🏘️'
                    : 'Comienza a ganar puntos escaneando el QR'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* RECOMPENSAS */}
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardIcon}>🎁</Text>
              <View>
                <Text style={styles.rewardTitle}>Tu Próxima Recompensa</Text>
                <Text style={styles.rewardSubtitle}>¡Estás cerca!</Text>
              </View>
            </View>

            <View style={styles.rewardContent}>
              <View style={styles.rewardItemHeader}>
                <Text style={styles.rewardItemIcon}>🚌</Text>
                <View style={styles.rewardItemText}>
                  <Text style={styles.rewardItemTitle}>Abono de Transporte</Text>
                  <Text style={styles.rewardItemSubtitle}>Vale 10 soles</Text>
                </View>
              </View>

              <View style={styles.rewardProgressContainer}>
                <View style={styles.rewardProgressHeader}>
                  <Text style={styles.rewardProgressText}>{userPoints} / 1,500 pts</Text>
                  <Text style={styles.rewardProgressPercentage}>
                    {Math.round((userPoints / 1500) * 100)}%
                  </Text>
                </View>
                <View style={styles.rewardProgressBarContainer}>
                  <View 
                    style={[
                      styles.rewardProgressBar, 
                      { width: `${Math.min((userPoints / 1500) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.rewardMissing}>Te faltan {Math.max(1500 - userPoints, 0)} puntos</Text>
            </View>

            <View style={styles.rewardFooter}>
              <Text style={styles.rewardFooterText}>
                💡 Gana más puntos escaneando QR y sacando tu basura a tiempo
              </Text>
            </View>
          </View>

          {/* SERVICIOS ACTIVOS */}
          {garbageEnabled && (
            <View style={styles.servicesContainer}>
              <View style={styles.serviceActive}>
                <Text style={styles.serviceActiveText}>🗑️ Basura • Activo</Text>
              </View>
              <View style={styles.serviceRecycling}>
                <Text style={styles.serviceActiveText}>♻️ Reciclaje • Activo</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTÓN DE PRUEBA */}
      <View style={styles.testButtons}>
        <TouchableOpacity 
          style={[styles.testButton, styles.testButtonBlue]}
          onPress={handleTruckSimulation}
        >
          <Text style={styles.testButtonText}>🚛 Camión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;