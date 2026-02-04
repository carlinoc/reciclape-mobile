import React from 'react';
import { View, Text, Switch as RNSwitch, StyleSheet } from 'react-native';

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

/**
 * Switch - Componente de switch/toggle reutilizable
 * @component Common/Switch
 */
const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNSwitch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: '#E5E7EB', true: '#4CAF50' }}
        thumbColor={checked ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
});

export default Switch;