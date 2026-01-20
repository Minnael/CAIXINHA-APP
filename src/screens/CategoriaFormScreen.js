import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useCategorias } from '../contexts/CategoriaContext';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import theme from '../styles/theme';

/**
 * Tela de formulário de categoria (criar/editar)
 */
export default function CategoriaFormScreen({ route, navigation }) {
  const { categoria } = route.params || {};
  const isEdit = !!categoria;
  
  const { criarCategoria, atualizarCategoria, deletarCategoria } = useCategorias();
  
  const [nome, setNome] = useState(categoria?.nome || '');
  const [icone, setIcone] = useState(categoria?.icone || '');
  const [descricao, setDescricao] = useState(categoria?.descricao || '');
  const [gastoMensal, setGastoMensal] = useState(
    categoria?.gastoMensal ? categoria.gastoMensal.toString() : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!nome.trim()) {
      setError('O nome da categoria é obrigatório');
      return false;
    }
    
    if (nome.trim().length > 100) {
      setError('O nome deve ter no máximo 100 caracteres');
      return false;
    }
    
    if (descricao.length > 500) {
      setError('A descrição deve ter no máximo 500 caracteres');
      return false;
    }
    
    if (gastoMensal && isNaN(parseFloat(gastoMensal))) {
      setError('O gasto mensal deve ser um número válido');
      return false;
    }
    
    if (gastoMensal && parseFloat(gastoMensal) < 0) {
      setError('O gasto mensal não pode ser negativo');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setLoading(true);
    
    const data = {
      nome: nome.trim(),
      icone: icone.trim() || null,
      descricao: descricao.trim() || null,
      gastoMensal: gastoMensal ? parseFloat(gastoMensal) : 0,
    };
    
    try {
      const result = isEdit
        ? await atualizarCategoria(categoria.id, data)
        : await criarCategoria(data);
      
      if (result.success) {
        navigation.goBack();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const result = await deletarCategoria(categoria.id);
            setLoading(false);
            
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Erro', result.error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
          </Text>
          
          {error && <ErrorMessage message={error} />}
          
          <Input
            label="Nome *"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Alimentação, Transporte..."
            maxLength={100}
            editable={!loading}
          />
          
          <Input
            label="Ícone (Emoji)"
            value={icone}
            onChangeText={setIcone}
            placeholder="Ex: 🍔, 🚗, 🏠..."
            maxLength={10}
            editable={!loading}
          />
          
          <Input
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva esta categoria (opcional)"
            multiline
            numberOfLines={3}
            maxLength={500}
            editable={!loading}
          />
          
          <Input
            label="Meta Mensal (R$)"
            value={gastoMensal}
            onChangeText={setGastoMensal}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!loading}
          />
          
          <Button
            title={isEdit ? 'Salvar Alterações' : 'Criar Categoria'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
          
          {isEdit && (
            <Button
              title="Deletar Categoria"
              onPress={handleDelete}
              variant="danger"
              disabled={loading}
              style={styles.deleteButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
