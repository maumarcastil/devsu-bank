import { memo } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text } from '../../ui';
import type { Product } from '@/services/products/types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    const params = new URLSearchParams({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision,
    }).toString();
    router.push(`/product/${product.id}?${params}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card>
        <Text variant="subtitle">{product.name}</Text>
        <Text variant="caption" color="muted">
          #{product.id}
        </Text>
      </Card>
    </Pressable>
  );
});
