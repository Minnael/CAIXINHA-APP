import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useCategorias } from '../contexts/CategoriaContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import theme from '../styles/theme';

/**
 * Tela de listagem de categorias
 * Exibe todas as categorias do usuário com gasto atual vs meta
 */
export default function CategoriasListScreen({ navigation }) {
  const { categorias, loading, error, carregarCategorias, deletarCategoria } = useCategorias();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarCategorias();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    const result = await deletarCategoria(id);
    if (!result.success) {
      alert(result.error);
    }
  };

  const calcularPercentual = (gastoAtual, gastoMensal) => {
    if (!gastoMensal || gastoMensal === 0) return 0;
    return Math.min((gastoAtual / gastoMensal) * 100, 100);
  };

  const renderCategoria = ({ item }) => {
    const percentual = calcularPercentual(item.gastoAtual || 0, item.gastoMensal || 0);
    const isOverBudget = item.gastoAtual > item.gastoMensal;
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CategoriaDetalhes', { categoriaId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.icone}>{item.icone || '📊'}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              {item.descricao && (
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {item.descricao}
                </Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('CategoriaForm', { categoria: item })}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.valores}>
            <View>
              <Text style={styles.labelMenor}>Gasto Atual</Text>
              <Text style={[
                styles.valorAtual,
                isOverBudget && styles.valorExcedido
              ]}>
                R$ {(item.gastoAtual || 0).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.divisor} />
            
            <View>
              <Text style={styles.labelMenor}>Meta Mensal</Text>
              <Text style={styles.valorMeta}>
                R$ {(item.gastoMensal || 0).toFixed(2)}
              </Text>
            </View>
          </View>
          
          {item.gastoMensal > 0 && (
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
          
          <Text style={styles.totalGastos}>
            {item.totalGastos || 0} {(item.totalGastos || 0) === 1 ? 'gasto' : 'gastos'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && categorias.length === 0) {
    return <Loading message="Carregando categorias..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Categorias</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {error && <ErrorMessage message={error} style={styles.error} />}
      
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoria}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhuma categoria cadastrada
            </Text>
            <Text style={styles.emptySubtext}>
              Crie sua primeira categoria para começar
            </Text>
          </View>
        )}
      />
      
      <View style={styles.fab}>
        <Button
          title="+ Nova Categoria"
          onPress={() => navigation.navigate('CategoriaForm')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  logoutButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  error: {
    margin: theme.spacing.lg,
  },
  list: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icone: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  editButtonText: {
    fontSize: 20,
  },
  cardBody: {
    marginTop: theme.spacing.sm,
  },
  valores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  labelMenor: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  valorAtual: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  valorExcedido: {
    color: theme.colors.error,
  },
  valorMeta: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
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
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  totalGastos: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
  fab: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
