import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';

/**
 * Componente para exibir mensagens de erro
 */
export const ErrorMessage = ({ message, style = {} }) => {
  if (!message) return null;
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.error + '20', // 20% opacity
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  text: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
});

export default ErrorMessage;
