import { memo } from 'react';
import { Card, Text } from '../../ui';

interface ProductCardProps {
  id: string;
  name: string;
}

export const ProductCard = memo(function ProductCard({ id, name }: ProductCardProps) {
  return (
    <Card>
      <Text variant="subtitle">{name}</Text>
      <Text variant="caption" color="muted">#{id}</Text>
    </Card>
  );
});
