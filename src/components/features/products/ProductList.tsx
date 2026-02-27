import { useState, useMemo, useCallback } from 'react';
import { FlatList, View, TextInput, StyleSheet } from 'react-native';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
}

const mockProducts: Product[] = [
  { id: '001', name: 'Cuenta Corriente' },
  { id: '002', name: 'Cuenta de Ahorros' },
  { id: '003', name: 'Tarjeta de Crédito' },
  { id: '004', name: 'Tarjeta de Débito' },
  { id: '005', name: 'Préstamo Personal' },
  { id: '006', name: 'Inversión Plus' },
  { id: '007', name: 'Seguros Bank' },
  { id: '008', name: 'Cuenta Empresarial' },
  { id: '009', name: 'Crédito Hipotecario' },
  { id: '010', name: 'Crédito de Consumo' },
  { id: '011', name: 'Fondo de Inversión' },
  { id: '012', name: 'Depósito a Plazo' },
  { id: '013', name: 'Seguro de Vida' },
  { id: '014', name: 'Seguro de Auto' },
  { id: '015', name: 'Seguro de Hogar' },
  { id: '016', name: 'Tarjeta Prepago' },
  { id: '017', name: 'Cuenta Digital' },
  { id: '018', name: 'Préstamo Express' },
  { id: '019', name: 'Línea de Crédito' },
  { id: '020', name: 'Certificado de Depósito' },
];

export function ProductList() {
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return mockProducts;
    return mockProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard id={item.id} name={item.name} />
    ),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#8E8E93"
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  list: {
    paddingBottom: 16,
  },
});
