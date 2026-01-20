/**
 * Tema visual do aplicativo
 * Define cores, tamanhos e estilos globais com design moderno
 */
export const theme = {
  colors: {
    // Paleta Principal - Verde Moderno
    primary: '#10B981',      // Emerald 500 - Verde principal
    primaryDark: '#059669',  // Emerald 600 - Verde escuro
    primaryLight: '#34D399', // Emerald 400 - Verde claro
    
    // Paleta Secundária - Azul para contraste
    secondary: '#3B82F6',    // Blue 500
    secondaryDark: '#2563EB', // Blue 600
    secondaryLight: '#60A5FA', // Blue 400
    
    // Paleta de Acento
    accent: '#F59E0B',       // Amber 500
    accentLight: '#FBBF24',  // Amber 400
    
    // Estados
    success: '#10B981',      // Emerald 500
    successLight: '#D1FAE5', // Emerald 100
    successDark: '#059669',  // Emerald 600
    warning: '#F59E0B',      // Amber 500
    warningLight: '#FEF3C7', // Amber 100
    error: '#EF4444',        // Red 500
    errorLight: '#FEE2E2',   // Red 100
    info: '#3B82F6',         // Blue 500
    infoLight: '#DBEAFE',    // Blue 100
    
    // Fundos - Tema Claro
    background: '#F9FAFB',   // Gray 50 - Fundo principal claro
    backgroundLight: '#FFFFFF', // Branco puro
    surface: '#FFFFFF',      // Branco para cards
    surfaceDark: '#F3F4F6',  // Gray 100 - Superfícies alternativas
    surfaceCard: '#FFFFFF',
    
    // Textos - Tema Claro
    text: '#111827',         // Gray 900 - Texto principal
    textSecondary: '#6B7280', // Gray 500 - Texto secundário
    textLight: '#9CA3AF',    // Gray 400 - Texto suave
    textWhite: '#FFFFFF',    // Branco
    textDark: '#1F2937',     // Gray 800
    
    // Bordas - Tema Claro
    border: '#E5E7EB',       // Gray 200
    borderDark: '#D1D5DB',   // Gray 300
    borderLight: '#F3F4F6',  // Gray 100
    
    // Estados Desabilitados
    disabled: '#D1D5DB',     // Gray 300
    disabledText: '#9CA3AF', // Gray 400
    
    // Overlay e Sombras
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
  },
  
  gradients: {
    primary: ['#10B981', '#059669'],           // Verde gradient
    secondary: ['#3B82F6', '#2563EB'],         // Azul gradient
    success: ['#34D399', '#10B981', '#059669'], // Verde claro ao escuro
    warm: ['#F59E0B', '#EF4444'],              // Quente
    cool: ['#3B82F6', '#10B981'],              // Frio
    sunset: ['#F59E0B', '#EF4444', '#EC4899'], // Pôr do sol
  },
  
  spacing: {
    xs: 4,
    sm: 4,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 12,
    },
    colored: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export default theme;
