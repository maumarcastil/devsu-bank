import { ProductList } from '@/components/features/products/ProductList';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/stores/theme-store';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ProductList />
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.push('/create')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text variant="body" style={styles.buttonText}>
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
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  button: {
    backgroundColor: '#FFD54F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
});
