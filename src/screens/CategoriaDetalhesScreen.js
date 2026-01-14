import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useCategorias } from '../contexts/CategoriaContext';
import { useGastos } from '../contexts/GastoContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import theme from '../styles/theme';

/**
 * Tela de detalhes da categoria
 * Exibe informações da categoria e lista seus gastos
 */
export default function CategoriaDetalhesScreen({ route, navigation }) {
  const { categoriaId } = route.params;
  const { buscarCategoria } = useCategorias();
  const { deletarGasto } = useGastos();
  
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadCategoria = async () => {
    setError('');
    const result = await buscarCategoria(categoriaId);
    
    if (result.success) {
      setCategoria(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadCategoria();
  }, [categoriaId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategoria();
    setRefreshing(false);
  };

  const handleDeleteGasto = (gastoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja deletar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const result = await deletarGasto(gastoId);
            if (result.success) {
              handleRefresh(); // Recarrega dados
            } else {
              Alert.alert('Erro', result.error);
            }
          },
        },
      ]
    );
  };

  const renderGasto = ({ item }) => (
    <View style={styles.gastoCard}>
      <View style={styles.gastoHeader}>
        <View style={styles.gastoInfo}>
          <Text style={styles.gastoNome}>{item.nome}</Text>
          {item.descricao && (
            <Text style={styles.gastoDescricao} numberOfLines={2}>
              {item.descricao}
            </Text>
          )}
          <Text style={styles.gastoData}>
            {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.gastoActions}>
          <Text style={styles.gastoValor}>
            R$ {item.valor.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => handleDeleteGasto(item.id)}
            style={styles.deleteIcon}
          >
            <Text style={styles.deleteIconText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <Loading message="Carregando detalhes..." />;
  }

  if (error || !categoria) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message={error || 'Categoria não encontrada'} />
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }

  const percentual = categoria.gastoMensal > 0
    ? Math.min((categoria.gastoAtual / categoria.gastoMensal) * 100, 100)
    : 0;
  const isOverBudget = categoria.gastoAtual > categoria.gastoMensal;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.icone}>{categoria.icone || '📊'}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{categoria.nome}</Text>
            {categoria.descricao && (
              <Text style={styles.headerDescription}>{categoria.descricao}</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('CategoriaForm', { categoria })}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.summary}>
        <View style={styles.valores}>
          <View style={styles.valorBox}>
            <Text style={styles.labelMenor}>Gasto Atual</Text>
            <Text style={[
              styles.valorAtual,
              isOverBudget && styles.valorExcedido
            ]}>
              R$ {categoria.gastoAtual.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.valorBox}>
            <Text style={styles.labelMenor}>Meta Mensal</Text>
            <Text style={styles.valorMeta}>
              R$ {categoria.gastoMensal.toFixed(2)}
            </Text>
          </View>
        </View>
        
        {categoria.gastoMensal > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${percentual}%` },
                  isOverBudget && styles.progressFillOver,
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {percentual.toFixed(0)}%
            </Text>
          </View>
        )}
        
        {isOverBudget && (
          <Text style={styles.alertText}>
            ⚠️ Você excedeu a meta mensal em R$ {(categoria.gastoAtual - categoria.gastoMensal).toFixed(2)}
          </Text>
        )}
      </View>
      
      <View style={styles.gastosSection}>
        <View style={styles.gastosSectionHeader}>
          <Text style={styles.gastosTitle}>
            Gastos ({categoria.totalGastos})
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('GastoForm', { categoriaId: categoria.id })}
            style={styles.addGastoButton}
          >
            <Text style={styles.addGastoText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={categoria.gastos || []}
          keyExtractor={(item) => item.id}
          renderItem={renderGasto}
          contentContainerStyle={styles.gastosList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum gasto nesta categoria</Text>
              <Text style={styles.emptySubtext}>
                Adicione seu primeiro gasto
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  icone: {
    fontSize: 48,
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  editButtonText: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  summary: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  valores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  valorBox: {
    alignItems: 'center',
  },
  labelMenor: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  valorAtual: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
  },
  valorExcedido: {
    color: theme.colors.error,
  },
  valorMeta: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.full,
  },
  progressFillOver: {
    backgroundColor: theme.colors.error,
  },
  progressText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    minWidth: 50,
    textAlign: 'right',
  },
  alertText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
  gastosSection: {
    flex: 1,
  },
  gastosSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  gastosTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  addGastoButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
  },
  addGastoText: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  gastosList: {
    padding: theme.spacing.lg,
  },
  gastoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  gastoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gastoInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  gastoNome: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  gastoDescricao: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  gastoData: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  gastoActions: {
    alignItems: 'flex-end',
  },
  gastoValor: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  deleteIcon: {
    padding: theme.spacing.xs,
  },
  deleteIconText: {
    fontSize: 18,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  errorButton: {
    margin: theme.spacing.lg,
  },
});
