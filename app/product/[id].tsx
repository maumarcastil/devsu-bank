import { Text } from '@/components/ui/text';
import { useTheme } from '@/stores/theme-store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const detailValues = {
    nombre: 'Cuenta Corriente Plus',
    descripcion: 'Cuenta transaccional sin comisiones por mantenimiento.',
    liberacion: '01/03/2025',
    revision: '12/03/2025',
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

  const handleConfirmDelete = useCallback(() => {
    // Aquí iría la lógica para eliminar el producto
    console.log('Eliminando producto:', id);
    bottomSheetRef.current?.close();
    // Después de eliminar, navegar atrás
    // router.back();
  }, [id, router]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.root, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push(`/product/${id}/edit`)}
            style={({ pressed }) => [
              styles.actionButton,
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
              styles.actionButton,
              { backgroundColor: colors.error, borderColor: colors.error },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text variant="body" style={{ color: '#fff', fontWeight: '600' }}>
              Eliminar
            </Text>
          </Pressable>
        </View>
      </ScrollView>

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
              style={({ pressed }) => [
                styles.confirmButton,
                { backgroundColor: '#FFD54F' },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text variant="body" style={styles.confirmButtonText}>
                Confirmar
              </Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  root: {
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
    marginBottom: 24,
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
  actions: {
    marginTop: 8,
  },
  actionButton: {
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
});
