// components/NotificationSettings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Switch from './common/Switch';
import { useFCM } from '../hooks/useFCM';

interface NotificationSettingsProps {
  style?: any;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ style }) => {
  const { notificationsEnabled, fcmToken, requestPermissions } = useFCM();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(notificationsEnabled);
  }, [notificationsEnabled]);

  const handleToggleNotifications = async (value: boolean) => {
    if (value && !notificationsEnabled) {
      // Usuario quiere activar notificaciones
      const granted = await requestPermissions();
      
      if (!granted) {
        Alert.alert(
          'Permisos necesarios',
          'Para recibir avisos del camión de basura, necesitas activar las notificaciones en la configuración de tu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configuración', onPress: () => {
              // TODO: Abrir configuración del dispositivo
              console.log('Abrir configuración del dispositivo');
            }}
          ]
        );
        return;
      }
    }
    
    setIsEnabled(value);
  };

  return (
    <View style={[{ padding: 16 }, style]}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        Notificaciones
      </Text>
      
      <Switch
        checked={isEnabled}
        onChange={handleToggleNotifications}
        label="🔔 Avisos del camión de basura"
      />
      
      <Text style={{ 
        fontSize: 12, 
        color: '#666', 
        marginTop: 8,
        fontStyle: 'italic' 
      }}>
        {fcmToken 
          ? '✅ Configurado para recibir notificaciones' 
          : '⚠️ Token de notificaciones no disponible'
        }
      </Text>
      
      {!notificationsEnabled && (
        <TouchableOpacity
          style={{
            backgroundColor: '#EFF6FF',
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
          }}
          onPress={() => handleToggleNotifications(true)}
        >
          <Text style={{ color: '#1E40AF', fontSize: 13, textAlign: 'center' }}>
            💡 Toca aquí para activar las notificaciones del camión
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NotificationSettings;