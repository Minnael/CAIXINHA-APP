import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { CategoriaProvider } from './src/contexts/CategoriaContext';
import { GastoProvider } from './src/contexts/GastoContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente raiz da aplicação
 * Configura providers de contexto e navegação
 */
export default function App() {
  return (
    <AuthProvider>
      <CategoriaProvider>
        <GastoProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </GastoProvider>
      </CategoriaProvider>
    </AuthProvider>
  );
}
