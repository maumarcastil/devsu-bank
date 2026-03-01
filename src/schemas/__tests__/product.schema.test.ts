import { z } from 'zod';
import { productSchema, editProductSchema } from '../product.schema';

describe('product.schema', () => {
  const validProduct = {
    id: 'PROD-001',
    name: 'Producto de Prueba',
    description: 'Esta es una descripción válida con más de 10 caracteres',
    logo: 'https://example.com/logo.png',
    date_release: new Date().toISOString().split('T')[0], // Today
    date_revision: '2025-01-01',
  };

  describe('productSchema', () => {
    it('should validate a valid product', () => {
      const result = productSchema.safeParse(validProduct);

      expect(result.success).toBe(true);
    });

    describe('id validation', () => {
      it('should fail when id is empty', () => {
        const product = { ...validProduct, id: '' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Requerido');
        }
      });

      it('should pass when id has at least 1 character', () => {
        const product = { ...validProduct, id: 'A' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });

    describe('name validation', () => {
      it('should fail when name has less than 5 characters', () => {
        const product = { ...validProduct, name: 'Test' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Mínimo 5 caracteres');
        }
      });

      it('should fail when name has more than 100 characters', () => {
        const product = { ...validProduct, name: 'A'.repeat(101) };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Máximo 100 caracteres');
        }
      });

      it('should pass when name has exactly 5 characters', () => {
        const product = { ...validProduct, name: '12345' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });

      it('should pass when name has exactly 100 characters', () => {
        const product = { ...validProduct, name: 'A'.repeat(100) };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });

    describe('description validation', () => {
      it('should fail when description has less than 10 characters', () => {
        const product = { ...validProduct, description: 'Short' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Mínimo 10 caracteres');
        }
      });

      it('should fail when description has more than 200 characters', () => {
        const product = { ...validProduct, description: 'A'.repeat(201) };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Máximo 200 caracteres');
        }
      });

      it('should pass when description has exactly 10 characters', () => {
        const product = { ...validProduct, description: '1234567890' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });

      it('should pass when description has exactly 200 characters', () => {
        const product = { ...validProduct, description: 'A'.repeat(200) };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });

    describe('logo validation', () => {
      it('should fail when logo is empty', () => {
        const product = { ...validProduct, logo: '' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Requerido');
        }
      });

      it('should pass when logo has at least 1 character', () => {
        const product = { ...validProduct, logo: 'X' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });

    describe('date_release validation', () => {
      it('should fail when date_release is before today', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const product = {
          ...validProduct,
          date_release: yesterday.toISOString().split('T')[0],
        };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Debe ser mayor o igual a la fecha actual');
        }
      });

      it('should pass when date_release is today', () => {
        const today = new Date().toISOString().split('T')[0];
        const product = { ...validProduct, date_release: today };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });

      it('should pass when date_release is in the future', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const product = {
          ...validProduct,
          date_release: tomorrow.toISOString().split('T')[0],
        };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });

    describe('date_revision validation', () => {
      it('should accept any string for date_revision (no validation)', () => {
        const product = { ...validProduct, date_revision: '' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });

      it('should accept valid date for date_revision', () => {
        const product = { ...validProduct, date_revision: '2025-12-31' };
        const result = productSchema.safeParse(product);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('editProductSchema', () => {
    it('should allow empty id for edit operations', () => {
      const product = { ...validProduct, id: '' };
      const result = editProductSchema.safeParse(product);

      expect(result.success).toBe(true);
    });

    it('should validate same rules as productSchema for other fields', () => {
      const invalidProduct = {
        ...validProduct,
        id: '',
        name: 'Test', // Less than 5 characters
      };
      const result = editProductSchema.safeParse(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mínimo 5 caracteres');
      }
    });
  });
});
