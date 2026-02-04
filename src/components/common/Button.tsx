import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Button - Componente de botón reutilizable
 * @component Common/Button
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'tertiary' && styles.tertiaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.primaryButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
    variant === 'tertiary' && styles.tertiaryButtonText,
    disabled && styles.disabledButtonText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Primary variant
  primaryButton: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },

  // Secondary variant
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  secondaryButtonText: {
    color: '#2563EB',
  },

  // Tertiary variant
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    color: '#2563EB',
  },

  // Disabled state
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});

export default Button;