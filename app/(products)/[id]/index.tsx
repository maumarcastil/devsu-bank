import { Text } from '@/components/ui/text';
import { useDeleteProduct, useProduct } from '@/hooks/useProducts';
import { useTheme } from '@/stores/theme-store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { format, parse, isValid } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProductDetail() {
  const router = useRouter();
  const { colors } = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: product, isLoading, error } = useProduct(id);
  const { mutate: deleteProduct, isPending, isSuccess } = useDeleteProduct();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (!isValid(parsed)) return '---';
    return format(parsed, 'dd/MM/yyyy');
  };

  const detailValues = {
    nombre: product?.name ?? '---',
    descripcion: product?.description ?? '---',
    liberacion: formatDate(product?.date_release ?? ''),
    revision: formatDate(product?.date_revision ?? ''),
    logo: product?.logo ?? '',
  };

  const infoRows = [
    { label: 'Nombre', value: detailValues.nombre },
    { label: 'Descripción', value: detailValues.descripcion },
  ];

  const dateRows = [
    { label: 'Fecha liberación', value: detailValues.liberacion },
    { label: 'Fecha revisión', value: detailValues.revision },
  ];

  const handleDeletePress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      bottomSheetRef.current?.close();
      router.back();
    }
  }, [isSuccess, router]);

  const handleConfirmDelete = useCallback(() => {
    if (id) {
      deleteProduct(id);
    }
  }, [id, deleteProduct]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Cargando...' }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text variant="body" color="muted">
          Error al cargar el producto
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" color="primary">
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: id ? `Producto ${id}` : 'Detalle del producto' }} />
        <View style={styles.headerSection}>
          <Text variant="title">ID: {id ?? '---'}</Text>
          <Text variant="body" color="muted" style={styles.subtleText}>
            Información extra
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
          <View style={styles.infoGrid}>
            {infoRows.map((item) => (
              <View key={item.label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text variant="label" color="muted" style={styles.labelText}>
                  {item.label}
                </Text>
                <Text variant="body" style={styles.valueText} numberOfLines={3}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoPreview}>
              <View style={styles.logoAccent} />
            </View>
          </View>

          <View style={styles.infoGrid}>
            {dateRows.map((item) => (
              <View key={item.label} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text variant="label" color="muted" style={styles.labelText}>
                  {item.label}
                </Text>
                <Text variant="body" style={styles.valueText} numberOfLines={2}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => {
            const params = new URLSearchParams({
              name: product?.name ?? '',
              description: product?.description ?? '',
              logo: product?.logo ?? '',
              date_release: product?.date_release ?? '',
              date_revision: product?.date_revision ?? '',
            }).toString();
            router.push(`/${id}/edit?${params}`);
          }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" color="primary">
            Editar
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDeletePress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.error, borderColor: colors.error },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" style={{ color: '#fff', fontWeight: '600' }}>
            Eliminar
          </Text>
        </Pressable>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['35%']}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Pressable onPress={handleCloseBottomSheet} style={styles.closeButton}>
              <Text variant="body" style={{ fontSize: 24, color: colors.textMuted }}>
                ×
              </Text>
            </Pressable>
          </View>

          <View style={styles.bottomSheetBody}>
            <Text variant="body" style={[styles.confirmationText, { color: colors.text }]}>
              ¿Estás seguro de eliminar el producto {detailValues.nombre}?
            </Text>
          </View>

          <View style={styles.bottomSheetActions}>
            <Pressable
              onPress={handleConfirmDelete}
              disabled={isPending}
              style={({ pressed }) => [
                styles.confirmButton,
                { backgroundColor: '#FFD54F' },
                pressed && styles.buttonPressed,
                isPending && styles.buttonDisabled,
              ]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <Text variant="body" style={styles.confirmButtonText}>
                  Confirmar
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleCloseBottomSheet}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text variant="body" color="primary">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  subtleText: {
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  infoGrid: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  labelText: {
    flex: 0,
    marginRight: 8,
    maxWidth: '40%',
  },
  valueText: {
    flex: 1,
    textAlign: 'right',
    paddingLeft: 8,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logoPreview: {
    width: '100%',
    aspectRatio: 1.7,
    borderRadius: 12,
    backgroundColor: '#FFD54F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoAccent: {
    width: '40%',
    height: 20,
    backgroundColor: '#FFFFFF80',
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  closeButton: {
    padding: 4,
  },
  bottomSheetBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomSheetActions: {
    paddingBottom: 32,
    paddingTop: 16,
    gap: 12,
  },
  confirmButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
});
