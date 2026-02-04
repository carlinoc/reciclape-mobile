import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  style?: any;
}

/**
 * PasswordInput - Campo de contraseña reutilizable con ojo para mostrar/ocultar
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  maxLength = 50,
  style
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[{ marginBottom: 20 }, style]}>
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '500', 
        marginBottom: 8, 
        color: '#374151' 
      }}>
        {label}
      </Text>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#D1D5DB', 
        borderRadius: 8, 
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF' 
      }}>
        <TextInput
          style={{ 
            flex: 1, 
            paddingVertical: 16, 
            fontSize: 16, 
            color: '#111827' 
          }}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          maxLength={maxLength}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 20 }}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordInput;