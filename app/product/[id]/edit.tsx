import { ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/stores/theme-store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  nombre: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  logo: z.string().min(1, 'Requerido'),
  fechaLiberacion: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Debe ser mayor o igual a la fecha actual',
  }),
  fechaRevision: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

function calculateRevisionDate(liberacion: string): string {
  if (!liberacion) return '';
  const date = new Date(liberacion);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

export default function ProductEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const defaultValues: ProductFormData = {
    id: id || '',
    nombre: 'Cuenta Corriente Plus',
    descripcion: 'Cuenta transaccional sin comisiones por mantenimiento.',
    logo: '',
    fechaLiberacion: '2025-03-01',
    fechaRevision: '2026-03-01',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const fechaLiberacion = watch('fechaLiberacion');

  const onSubmit = (_data: ProductFormData) => {
    console.log('Form submitted:', _data);
    router.back();
  };

  const onReset = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.root, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Editar Producto' }} />

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text variant="label" color="muted">
          ID
        </Text>
        <Controller
          control={control}
          name="id"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.inputDisabled,
                { backgroundColor: colors.surface, color: colors.textMuted },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={false}
            />
          )}
        />

        <Text variant="label" color="muted" style={styles.label}>
          Nombre
        </Text>
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Ingrese nombre"
              placeholderTextColor={colors.textMuted}
            />
          )}
        />
        {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}

        <Text variant="label" color="muted" style={styles.label}>
          Descripción
        </Text>
        <Controller
          control={control}
          name="descripcion"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={3}
              placeholder="Ingrese descripción"
              placeholderTextColor={colors.textMuted}
            />
          )}
        />
        {errors.descripcion && <Text style={styles.error}>{errors.descripcion.message}</Text>}

        <Text variant="label" color="muted" style={styles.label}>
          Logo
        </Text>
        <Controller
          control={control}
          name="logo"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="URL del logo"
              placeholderTextColor={colors.textMuted}
            />
          )}
        />
        {errors.logo && <Text style={styles.error}>{errors.logo.message}</Text>}

        <Text variant="label" color="muted" style={styles.label}>
          Fecha Liberación
        </Text>
        <Controller
          control={control}
          name="fechaLiberacion"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
            />
          )}
        />
        {errors.fechaLiberacion && (
          <Text style={styles.error}>{errors.fechaLiberacion.message}</Text>
        )}

        <Text variant="label" color="muted" style={styles.label}>
          Fecha Revisión
        </Text>
        <Controller
          control={control}
          name="fechaRevision"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.inputDisabled,
                { backgroundColor: colors.surface, color: colors.textMuted },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={calculateRevisionDate(fechaLiberacion) || value}
              editable={false}
            />
          )}
        />
        {errors.fechaRevision && <Text style={styles.error}>{errors.fechaRevision.message}</Text>}
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: '#FFD54F', borderColor: '#FFD54F' },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" style={{ color: '#000', fontWeight: '600' }}>
            Guardar
          </Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" color="muted">
            Reiniciar
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    marginTop: 8,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 8,
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
});
