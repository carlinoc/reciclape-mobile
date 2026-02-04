import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'tel' | 'email';
  maxLength?: number;
  style?: object;
}

/**
 * Input - Componente de input reutilizable
 * @component Common/Input
 */
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  maxLength,
  style,
}) => {
  // Mapear tipo a keyboardType de React Native
  const getKeyboardType = (): KeyboardTypeOptions => {
    switch (type) {
      case 'tel':
        return 'phone-pad';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={getKeyboardType()}
        maxLength={maxLength}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    color: '#111827',
  },
});

export default Input;