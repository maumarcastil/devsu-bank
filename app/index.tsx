import { ProductList } from '@/components/features/products/ProductList';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/stores/theme-store';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ProductList />
      <View style={styles.footerBackground}>
        <Pressable
          onPress={() => router.push('/product/create')}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <Text variant="body" style={styles.fabText}>
            Nuevo Producto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  footerBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F2F7',
    paddingBottom: 24,
    paddingTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#FFD54F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  fabPressed: {
    opacity: 0.8,
  },
  fabText: {
    color: '#000',
    fontWeight: '600',
  },
});
