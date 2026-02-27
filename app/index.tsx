import { ProductList } from '@/src/components/features/products/ProductList';
import { StyleSheet, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <ProductList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
