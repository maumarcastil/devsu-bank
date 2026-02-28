import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState, Input, Skeleton } from '@/components/ui';

import { ProductCard } from './ProductCard';

import type { Product } from '@/services/products/types';

import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/stores/theme-store';

export function ProductList() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const { data: productsResponse, isLoading, isError } = useProducts();
  const products = productsResponse?.data ?? [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard id={item.id} name={item.name} />,
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Skeleton height={44} borderRadius={8} />
        </View>
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={[styles.skeletonCard, { backgroundColor: colors.card }]}>
              <Skeleton height={20} width="60%" />
              <Skeleton height={16} width="40%" marginTop={8} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Input placeholder="Buscar productos" value={search} onChangeText={setSearch} />
        </View>
        <EmptyState
          title="Error al cargar"
          message="No se pudieron cargar los productos. Intenta de nuevo."
        />
      </View>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Input placeholder="Buscar productos" value={search} onChangeText={setSearch} />
        </View>
        <EmptyState title="Sin productos" message="No hay productos disponibles en este momento." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Input placeholder="Buscar productos" value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});
