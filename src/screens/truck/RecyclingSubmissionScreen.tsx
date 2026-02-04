import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NeighborStackParamList } from '../../types/navigation.types';
import Button from '../../components/common/Button';
import historyService from '../../../services/api/history.service';

type RecyclingSubmissionRouteProp = RouteProp<NeighborStackParamList, 'RecyclingSubmission'>;

interface RecyclingType {
  id: string;
  name: string;
  pointsGiven: number;
  unitType: string;
}

const RecyclingSubmissionScreen: React.FC = () => {
  const route = useRoute<RecyclingSubmissionRouteProp>();
  const navigation = useNavigation<any>();
  const { truckId, userId, municipalityId } = route.params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [types, setTypes] = useState<RecyclingType[]>([]);
  
  // Estado para guardar el peso por cada ID de material
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRecyclingTypes();
  }, []);

  const fetchRecyclingTypes = async () => {
    try {
      const response = await fetch(`https://reciclape.onrender.com/recycling-types?municipalityId=${municipalityId}`);
      const data = await response.json();
      // Filtramos para no mostrar "Basura" aquí, solo materiales reciclables
      const filtered = data.filter((t: any) => !t.isGarbage && t.isActive);
      setTypes(filtered);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los tipos de reciclaje');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: string, value: string) => {
    // Solo permite números, eliminando cualquier caracter no numérico
        const numericValue = value.replace(/[^0-9]/g, '');
        setQuantities(prev => ({
            ...prev,
            [id]: numericValue
        }));
    };

  const calculateTotalPoints = () => {
    return types.reduce((acc, type) => {
      const qty = parseFloat(quantities[type.id] || '0');
      return acc + (qty * type.pointsGiven);
    }, 0);
  };

  const handleSubmit = async () => {
    const items = types
      .filter(type => parseFloat(quantities[type.id] || '0') > 0)
      .map(type => {
        const qty = parseFloat(quantities[type.id]);
        return {
          recyclingTypeId: type.id,
          quantity: qty,
          pointsEarned: qty * type.pointsGiven
        };
      });

    if (items.length === 0) {
      Alert.alert('Atención', 'Ingresa el peso de al menos un material.');
      return;
    }

    // --- LÓGICA DE SIMULACIÓN QR AGREGADA ---
    Alert.alert(
      '📷 Escaneando QR',
      'Acerca el código QR del operador a la cámara para confirmar la entrega.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular Escaneo',
          onPress: async () => {
            setSubmitting(true);
            try {
              const totalPoints = calculateTotalPoints();
              const result = await historyService.registerCollection({
                userId,
                truckId,
                municipalityId,
                activityType: 'reciclaje',
                pointsToAward: totalPoints,
                items: items
              });

              if (result.success) {
                navigation.navigate('Confirmation', { points: totalPoints });
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo registrar el reciclaje');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView style={localStyles.container}>
      <Text style={localStyles.title}>Registrar Pesos (Kg)</Text>
      <Text style={localStyles.subtitle}>Ingresa la cantidad recolectada por material</Text>

      {types.map(type => (
        <View key={type.id} style={localStyles.itemRow}>
          <View style={{ flex: 1 }}>
            <Text style={localStyles.itemName}>{type.name}</Text>
            <Text style={localStyles.itemPoints}>{type.pointsGiven} pts por Kg</Text>
          </View>
          <TextInput
            style={localStyles.input}
            keyboardType="numeric"
            placeholder="0.0"
            value={quantities[type.id] || ''}
            onChangeText={(val) => handleQuantityChange(type.id, val)}
          />
        </View>
      ))}

      <View style={localStyles.footer}>
        <View style={localStyles.totalRow}>
          <Text style={localStyles.totalLabel}>Total Puntos a Ganar:</Text>
          <Text style={localStyles.totalValue}>{calculateTotalPoints().toFixed(0)}</Text>
        </View>
        <Button onPress={handleSubmit} disabled={submitting}>
          {submitting ? 'Enviando...' : 'Confirmar Recogida'}
        </Button>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#374151' },
  itemPoints: { fontSize: 12, color: '#10B981' },
  input: { 
    width: 80, 
    height: 45, 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 8, 
    textAlign: 'center',
    fontSize: 18,
    color: '#111827'
  },
  footer: { marginTop: 30, paddingBottom: 50 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#2563EB' }
});

export default RecyclingSubmissionScreen;