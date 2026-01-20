import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Componente Card moderno e reutilizável
 */
export const Card = ({ 
  children, 
  gradient = false,
  gradientColors = null,
  style = {},
  variant = 'default', // 'default', 'elevated', 'outlined'
}) => {
  const cardStyles = [
    styles.card,
    variant === 'elevated' && styles.cardElevated,
    variant === 'outlined' && styles.cardOutlined,
    style,
  ];

  if (gradient) {
    const colors = gradientColors || [
      theme.colors.primary + '15',
      theme.colors.primary + '05'
    ];
    
    return (
      <View style={cardStyles}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  cardElevated: {
    ...theme.shadows.lg,
  },
  cardOutlined: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  gradientContainer: {
    padding: theme.spacing.lg,
    margin: -theme.spacing.lg, // Compensar padding do card
  },
});

export default Card;
