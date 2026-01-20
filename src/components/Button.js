import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Componente de botão customizado e reutilizável com design moderno
 */
export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  icon = null,
  style = {},
  textStyle = {},
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const isDisabled = disabled || loading;
  
  const useGradient = !isDisabled && (variant === 'primary' || variant === 'secondary');
  
  const gradientColors = variant === 'primary' 
    ? theme.gradients.primary 
    : theme.gradients.secondary;
  
  const buttonStyles = [
    styles.button,
    variant === 'outline' && styles.buttonOutline,
    variant === 'danger' && styles.buttonDanger,
    variant === 'ghost' && styles.buttonGhost,
    isDisabled && styles.buttonDisabled,
    !useGradient && variant === 'primary' && styles.buttonPrimary,
    !useGradient && variant === 'secondary' && styles.buttonSecondary,
    size === 'small' && styles.buttonSmall,
    size === 'large' && styles.buttonLarge,
    style,
  ];
  
  const textStyles = [
    styles.buttonText,
    size === 'small' && styles.textSmall,
    size === 'large' && styles.textLarge,
    (variant === 'primary' || variant === 'secondary' || variant === 'danger') && styles.textWhite,
    variant === 'outline' && styles.textOutline,
    variant === 'ghost' && styles.textGhost,
    isDisabled && styles.textDisabled,
    textStyle,
  ];
  
  const content = (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff'} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </>
  );
  
  if (useGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={buttonStyles}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50, // Bordas completamente arredondadas (pill button)
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 50,
  },
  buttonSmall: {
    minHeight: 40,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  buttonLarge: {
    minHeight: 60,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    borderRadius: 50,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    borderRadius: 50,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md - 2,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    borderRadius: 50,
  },
  buttonDanger: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    borderRadius: 50,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    borderRadius: 50,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  textSmall: {
    fontSize: theme.fontSize.sm,
  },
  textLarge: {
    fontSize: theme.fontSize.lg,
  },
  textWhite: {
    color: theme.colors.textWhite,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textGhost: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.disabledText,
  },
});

export default Button;
