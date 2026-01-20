import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Telas de autenticação
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Telas de categorias
import CategoriasListScreen from '../screens/CategoriasListScreen';
import CategoriaFormScreen from '../screens/CategoriaFormScreen';
import CategoriaDetalhesScreen from '../screens/CategoriaDetalhesScreen';

// Telas de gastos
import GastosListScreen from '../screens/GastosListScreen';
import GastoFormScreen from '../screens/GastoFormScreen';

// Componentes de UI
import Loading from '../components/Loading';
import theme from '../styles/theme';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

/**
 * Navegação por tabs no rodapé com emojis
 */
function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: 80,
          paddingBottom: 12,
          paddingTop: 12,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="CategoriasTab"
        component={CategoriasStack}
        options={{
          tabBarLabel: 'Categorias',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏷️</Text>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Resetar para a tela inicial do stack
            const state = navigation.getState();
            const categoriasRoute = state.routes.find(r => r.name === 'CategoriasTab');
            
            if (categoriasRoute?.state?.index > 0) {
              navigation.navigate('CategoriasTab', {
                screen: 'CategoriasList',
              });
            }
          },
        })}
      />
      <BottomTab.Screen
        name="GastosTab"
        component={GastosStack}
        options={{
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>💰</Text>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Resetar para a tela inicial do stack
            const state = navigation.getState();
            const gastosRoute = state.routes.find(r => r.name === 'GastosTab');
            
            if (gastosRoute?.state?.index > 0) {
              navigation.navigate('GastosTab', {
                screen: 'GastosList',
              });
            }
          },
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * Stack de navegação de categorias
 */
function CategoriasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CategoriasList"
        component={CategoriasListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoriaForm"
        component={CategoriaFormScreen}
        options={({ route }) => ({
          title: route.params?.categoria ? 'Editar Categoria' : 'Nova Categoria',
        })}
      />
      <Stack.Screen
        name="CategoriaDetalhes"
        component={CategoriaDetalhesScreen}
        options={{ title: 'Detalhes da Categoria' }}
      />
      <Stack.Screen
        name="GastoForm"
        component={GastoFormScreen}
        options={{ title: 'Novo Gasto' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Stack de navegação de gastos
 */
function GastosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="GastosList"
        component={GastosListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GastoForm"
        component={GastoFormScreen}
        options={{ title: 'Novo Gasto' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Stack de autenticação (Login e Registro)
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/**
 * Componente principal de navegação
 * Decide entre mostrar auth stack ou main tabs baseado no estado de autenticação
 */
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
