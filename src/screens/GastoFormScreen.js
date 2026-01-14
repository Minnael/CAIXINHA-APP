import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGastos } from '../contexts/GastoContext';
import { useCategorias } from '../contexts/CategoriaContext';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import theme from '../styles/theme';

/**
 * Tela de formulário de gasto (criar)
 */
export default function GastoFormScreen({ route, navigation }) {
  const { categoriaId: categoriaIdParam } = route.params || {};
  const { criarGasto } = useGastos();
  const { categorias, carregarCategorias, loading: loadingCategorias } = useCategorias();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState(categoriaIdParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categorias.length === 0) {
      carregarCategorias();
    }
  }, []);

  const validateForm = () => {
    if (!nome.trim()) {
      setError('O nome do gasto é obrigatório');
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
    
    if (!valor || isNaN(parseFloat(valor))) {
      setError('O valor é obrigatório e deve ser um número válido');
      return false;
    }
    
    if (parseFloat(valor) <= 0) {
      setError('O valor deve ser maior que zero');
      return false;
    }
    
    if (!categoriaId) {
      setError('Selecione uma categoria');
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
      descricao: descricao.trim() || null,
      valor: parseFloat(valor),
      categoriaId: categoriaId,
    };
    
    try {
      const result = await criarGasto(data);
      
      if (result.success) {
        navigation.goBack();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao criar gasto');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategorias && categorias.length === 0) {
    return <Loading message="Carregando categorias..." />;
  }

  if (categorias.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>
            Nenhuma categoria cadastrada
          </Text>
          <Text style={styles.emptyStateText}>
            Você precisa criar pelo menos uma categoria antes de adicionar gastos
          </Text>
          <Button
            title="Criar Categoria"
            onPress={() => navigation.navigate('CategoriaForm')}
            style={styles.emptyStateButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Novo Gasto</Text>
          
          {error && <ErrorMessage message={error} />}
          
          <Input
            label="Nome *"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Almoço, Uber, Mercado..."
            maxLength={100}
            editable={!loading}
          />
          
          <Input
            label="Valor (R$) *"
            value={valor}
            onChangeText={setValor}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!loading}
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Categoria *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={categoriaId}
                onValueChange={(itemValue) => setCategoriaId(itemValue)}
                enabled={!loading}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                {categorias.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={`${cat.icone || '📁'} ${cat.nome}`}
                    value={cat.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <Input
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Detalhes do gasto (opcional)"
            multiline
            numberOfLines={3}
            maxLength={500}
            editable={!loading}
          />
          
          <Button
            title="Salvar Gasto"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
          
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
            disabled={loading}
            style={styles.cancelButton}
          />
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
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  pickerLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyStateButton: {
    minWidth: 200,
  },
});
