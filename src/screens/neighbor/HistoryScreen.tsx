import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { styles } from '../../styles/screens/neighbor/HistoryScreen.styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NeighborTabsParamList, NeighborStackParamList } from '../../types/navigation.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🚀 IMPORT DEL SERVICIO
import historyService, { HistoryTransaction } from '../../../services/api/history.service';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<NeighborTabsParamList, 'History'>,
  NativeStackNavigationProp<NeighborStackParamList>
>;

// Interfaz adaptada para la UI
interface HistoryItemUI {
  id: string;
  typeLabel: string; // 'Basura' | 'Reciclaje'
  icon: string;      // '🗑️' | '♻️'
  points: number;
  status: 'entregado' | 'saltado';
  time: string;
  date: string;
}

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  
  const [historyItems, setHistoryItems] = useState<HistoryItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        // Llamada al endpoint real
        const transactions = await historyService.getUserHistory(user.id);
        
        // Transformar data del backend para la UI
        const formattedItems = transactions.map(mapTransactionToUI);
        setHistoryItems(formattedItems);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  // Función para mapear la respuesta del backend a la UI
  const mapTransactionToUI = (tx: HistoryTransaction): HistoryItemUI => {
    const dateObj = new Date(tx.createdAt);
    
    // Formatear hora (HH:mm)
    const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Formatear fecha (DD MMM)
    const date = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    let typeLabel = 'Basura';
    let icon = '🗑️';

    if (tx.transactionType === 'EARN_RECYCLED') {
      typeLabel = 'Reciclaje';
      icon = '♻️';
    } else if (tx.transactionType === 'REDEEM') {
      typeLabel = 'Canje';
      icon = '🎁';
    }

    return {
      id: tx.id,
      typeLabel,
      icon,
      points: tx.points,
      status: tx.points > 0 ? 'entregado' : 'saltado', // Si ganó puntos es 'entregado'
      time,
      date,
    };
  };

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  const renderStatusBadge = (status: 'entregado' | 'saltado', points: number) => {
    const isDelivered = status === 'entregado';
    
    return (
      <View
        style={[
          styles.statusBadge,
          isDelivered ? styles.statusBadgeDelivered : styles.statusBadgeSkipped,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isDelivered ? styles.statusTextDelivered : styles.statusTextSkipped,
          ]}
        >
          {isDelivered ? `+${points} pts` : 'Saltado'} 
        </Text>
      </View>
    );
  };

  const renderHistoryItem = (item: HistoryItemUI) => {
    return (
      <View key={item.id} style={styles.historyItem}>
        <Text style={styles.historyItemIcon}>{item.icon}</Text>
        
        <View style={styles.historyItemContent}>
          <View style={styles.historyItemTop}>
            <Text style={styles.historyItemType}>{item.typeLabel}</Text>
            {renderStatusBadge(item.status, item.points)}
          </View>

          <View style={styles.historyItemBottom}>
            <Text style={styles.historyItemDate}>{item.date}</Text>
            <Text style={styles.historyItemSeparator}>•</Text>
            <Text style={styles.historyItemTime}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🚛</Text>
        <Text style={styles.emptyTitle}>
          Aquí verás las visitas del camión
        </Text>
        <Text style={styles.emptyMessage}>
          Cuando saques tu basura y escanees el QR, quedará registrado aquí.
        </Text>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Historial de Puntos</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando historial...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            {historyItems.length === 0 ? (
              renderEmptyState()
            ) : (
              historyItems.map((item) => renderHistoryItem(item))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;