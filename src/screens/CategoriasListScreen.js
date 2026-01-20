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
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>📋 Categorias</Text>
            <Text style={styles.subtitle}>Organize seus gastos</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
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
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CategoriaForm')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textWhite,
    opacity: 0.95,
    marginTop: theme.spacing.xs,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: theme.colors.textWhite,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  error: {
    margin: theme.spacing.lg,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icone: {
    fontSize: 22,
    marginRight: theme.spacing.xs,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  editButtonText: {
    fontSize: 18,
  },
  cardBody: {
    marginTop: theme.spacing.xs,
  },
  valores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  divisor: {
    width: 2,
    height: 28,
    backgroundColor: theme.colors.primary,
  },
  labelMenor: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: theme.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valorAtual: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  valorExcedido: {
    color: theme.colors.error,
  },
  valorMeta: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textDark,
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
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  progressFillOver: {
    backgroundColor: theme.colors.error,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  totalGastos: {
    fontSize: theme.fontSize.xs,
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.textWhite,
    fontWeight: theme.fontWeight.bold,
    lineHeight: 32,
    textAlign: 'center',
    marginTop: 4,
    marginLeft: 2,
  },
});
