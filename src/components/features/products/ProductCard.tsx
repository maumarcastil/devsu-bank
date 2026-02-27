import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProductCardProps {
  id: string;
  name: string;
}

export const ProductCard = memo(function ProductCard({ id, name }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.id}>#{id}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  id: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});
