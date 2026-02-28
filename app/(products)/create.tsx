import { DatePickerInput } from '@/components/ui/date-picker-input';
import { Text } from '@/components/ui/text';
import { useCreateProduct, useVerifyProductId } from '@/hooks/useProducts';
import { useTheme } from '@/stores/theme-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, addYears, isValid } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

const DATE_FORMAT = 'yyyy-MM-dd';

function getTodayString(): string {
  return format(new Date(), DATE_FORMAT);
}

const productSchema = z.object({
  id: z.string().min(1, 'Requerido'),
  name: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  logo: z.string().min(1, 'Requerido'),
  date_release: z.string().refine((dateStr) => dateStr >= getTodayString(), {
    message: 'Debe ser mayor o igual a la fecha actual',
  }),
  date_revision: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

function calculateRevisionDate(date_release: string): string {
  if (!date_release) return '';
  const parsed = parse(date_release, DATE_FORMAT, new Date());
  if (!isValid(parsed)) return '';
  return format(addYears(parsed, 1), DATE_FORMAT);
}

export default function ProductCreate() {
  const router = useRouter();
  const { colors } = useTheme();

  const defaultValues: ProductFormData = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  const id = watch('id');
  const fechaLiberacion = watch('date_release');

  const { refetch: verifyId } = useVerifyProductId(id);
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const onSubmit = async (data: ProductFormData) => {
    try {
      const { data: exists } = await verifyId();

      if (exists) {
        setError('id', { message: 'El ID ya existe' });
        return;
      }

      await createProduct({
        id: data.id,
        name: data.name,
        description: data.description,
        logo: data.logo,
        date_release: data.date_release,
        date_revision: calculateRevisionDate(data.date_release),
      });
      Alert.alert('Éxito', 'Producto creado exitosamente');
      router.back();
    } catch {
      Alert.alert('Error', 'Error al crear el producto. Intenta de nuevo.');
    }
  };

  const onReset = () => {
    reset(defaultValues);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: 'Crear Producto' }} />

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
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
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                  isPending && styles.inputDisabled,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Ingrese ID"
                placeholderTextColor={colors.textMuted}
                editable={!isPending}
              />
            )}
          />
          {errors.id && (
            <Text style={{ color: colors.error, fontSize: 12, marginBottom: 8 }}>
              {errors.id.message}
            </Text>
          )}

          <Text variant="label" color="muted" style={styles.label}>
            Nombre
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                  isPending && styles.inputDisabled,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Ingrese nombre"
                placeholderTextColor={colors.textMuted}
                editable={!isPending}
              />
            )}
          />
          {errors.name && (
            <Text style={{ color: colors.error, fontSize: 12, marginBottom: 8 }}>
              {errors.name.message}
            </Text>
          )}

          <Text variant="label" color="muted" style={styles.label}>
            Descripción
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: colors.surface, color: colors.text },
                  isPending && styles.inputDisabled,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={3}
                placeholder="Ingrese descripción"
                placeholderTextColor={colors.textMuted}
                editable={!isPending}
              />
            )}
          />
          {errors.description && (
            <Text style={{ color: colors.error, fontSize: 12, marginBottom: 8 }}>
              {errors.description.message}
            </Text>
          )}

          <Text variant="label" color="muted" style={styles.label}>
            Logo
          </Text>
          <Controller
            control={control}
            name="logo"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                  isPending && styles.inputDisabled,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="URL del logo"
                placeholderTextColor={colors.textMuted}
                editable={!isPending}
              />
            )}
          />
          {errors.logo && (
            <Text style={{ color: colors.error, fontSize: 12, marginBottom: 8 }}>
              {errors.logo.message}
            </Text>
          )}

          <Text variant="label" color="muted" style={styles.label}>
            Fecha Liberación
          </Text>
          <Controller
            control={control}
            name="date_release"
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                value={value}
                onChange={onChange}
                placeholder="YYYY-MM-DD"
                minimumDate={new Date()}
                editable={!isPending}
              />
            )}
          />
          {errors.date_release && (
            <Text style={{ color: colors.error, fontSize: 12, marginBottom: 8 }}>
              {errors.date_release.message}
            </Text>
          )}

          <Text variant="label" color="muted" style={styles.label}>
            Fecha Revisión
          </Text>
          <DatePickerInput
            value={calculateRevisionDate(fechaLiberacion)}
            onChange={() => {}}
            editable={false}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: '#FFD54F', borderColor: '#FFD54F' },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" style={{ color: '#000', fontWeight: '600' }}>
            {isPending ? 'Guardando...' : 'Enviar'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          disabled={isPending}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text variant="body" color="muted">
            Reiniciar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
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
});
