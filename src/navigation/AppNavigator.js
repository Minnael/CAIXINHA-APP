import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
const Tab = createBottomTabNavigator();

/**
 * Navegação por tabs (Categorias e Gastos)
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="CategoriasTab"
        component={CategoriasStack}
        options={{
          tabBarLabel: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📁</Text>
          ),
        }}
      />
      <Tab.Screen
        name="GastosTab"
        component={GastosStack}
        options={{
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>💰</Text>
          ),
        }}
      />
    </Tab.Navigator>
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

// Importação necessária para ícones
import { Text } from 'react-native';
