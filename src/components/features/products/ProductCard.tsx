import { memo } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text } from '../../ui';

interface ProductCardProps {
  id: string;
  name: string;
}

export const ProductCard = memo(function ProductCard({ id, name }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card>
        <Text variant="subtitle">{name}</Text>
        <Text variant="caption" color="muted">
          #{id}
        </Text>
      </Card>
    </Pressable>
  );
});
