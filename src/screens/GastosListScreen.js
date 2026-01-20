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
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={styles.cardContent}>
        <LinearGradient
          colors={[theme.colors.primary + '15', theme.colors.primary + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <View style={styles.categoriaTag}>
                <Text style={styles.cardCategoria}>🏷️ {item.categoriaNome}</Text>
              </View>
              {item.descricao && (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.descricao}
                </Text>
              )}
              <Text style={styles.cardData}>
                📅 {new Date(item.criadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
            
            <View style={styles.cardActions}>
              <View style={styles.valorContainer}>
                <Text style={styles.valorLabel}>Valor</Text>
                <Text style={styles.cardValor}>
                  R$ {item.valor.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
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
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>📊 Meus Gastos</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Gasto</Text>
            <Text style={styles.totalValor}>
              R$ {calcularTotalGastos().toFixed(2)}
            </Text>
          </View>
        </View>
      </LinearGradient>
      
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
  headerGradient: {
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  totalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textWhite,
    opacity: 0.95,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  totalValor: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textWhite,
  },
  filterSection: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  filterList: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },
  filterChipTextActive: {
    color: theme.colors.textWhite,
  },
  error: {
    margin: theme.spacing.lg,
  },
  list: {
    padding: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardContent: {
    backgroundColor: theme.colors.surface,
  },
  cardGradient: {
    padding: theme.spacing.lg,
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
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoriaTag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cardCategoria: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  cardData: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  valorContainer: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  valorLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    marginBottom: 2,
    fontWeight: theme.fontWeight.semibold,
  },
  cardValor: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
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
  fab: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
});
