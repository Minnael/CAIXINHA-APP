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
import { useGastos } from '../contexts/GastoContext';
import { useCategorias } from '../contexts/CategoriaContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import theme from '../styles/theme';

/**
 * Tela de listagem de todos os gastos
 */
export default function GastosListScreen({ navigation }) {
  const { gastos, loading, error, carregarGastos, deletarGasto } = useGastos();
  const { categorias, carregarCategorias } = useCategorias();
  const [refreshing, setRefreshing] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      carregarGastos(),
      carregarCategorias(),
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja deletar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const result = await deletarGasto(id);
            if (!result.success) {
              Alert.alert('Erro', result.error);
            }
          },
        },
      ]
    );
  };

  const gastosFiltrados = filtroCategoria
    ? gastos.filter(g => g.categoriaId === filtroCategoria)
    : gastos;

  const calcularTotalGastos = () => {
    return gastosFiltrados.reduce((total, gasto) => total + gasto.valor, 0);
  };

  const renderGasto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardCategoria}>📁 {item.categoriaNome}</Text>
          {item.descricao && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.descricao}
            </Text>
          )}
          <Text style={styles.cardData}>
            {new Date(item.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
        
        <View style={styles.cardActions}>
          <Text style={styles.cardValor}>
            R$ {item.valor.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCategoriaFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        filtroCategoria === item.id && styles.filterChipActive,
      ]}
      onPress={() => setFiltroCategoria(
        filtroCategoria === item.id ? null : item.id
      )}
    >
      <Text style={[
        styles.filterChipText,
        filtroCategoria === item.id && styles.filterChipTextActive,
      ]}>
        {item.icone} {item.nome}
      </Text>
    </TouchableOpacity>
  );

  if (loading && gastos.length === 0) {
    return <Loading message="Carregando gastos..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todos os Gastos</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValor}>
            R$ {calcularTotalGastos().toFixed(2)}
          </Text>
        </View>
      </View>
      
      {categorias.length > 0 && (
        <View style={styles.filterSection}>
          <FlatList
            horizontal
            data={categorias}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoriaFilter}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
      )}
      
      {error && <ErrorMessage message={error} style={styles.error} />}
      
      <FlatList
        data={gastosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderGasto}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {filtroCategoria ? 'Nenhum gasto nesta categoria' : 'Nenhum gasto cadastrado'}
            </Text>
            <Text style={styles.emptySubtext}>
              Adicione seu primeiro gasto
            </Text>
          </View>
        )}
      />
      
      <View style={styles.fab}>
        <Button
          title="+ Novo Gasto"
          onPress={() => navigation.navigate('GastoForm')}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  totalValor: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  filterSection: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
  },
  filterList: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  filterChipTextActive: {
    color: '#fff',
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
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardCategoria: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  cardData: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  cardValor: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  deleteButtonText: {
    fontSize: 20,
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
