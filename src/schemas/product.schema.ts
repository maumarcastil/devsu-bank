import { z } from 'zod';
import { DATE_FORMAT } from '@/constants/date';
import { getTodayString } from '@/utils/date.utils';

export const productSchema = z.object({
  id: z.string().min(1, 'Requerido'),
  name: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  logo: z.string().min(1, 'Requerido'),
  date_release: z.string().refine((dateStr) => dateStr >= getTodayString(), {
    message: 'Debe ser mayor o igual a la fecha actual',
  }),
  date_revision: z.string(),
});

export const editProductSchema = productSchema.extend({
  id: z.string(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;
