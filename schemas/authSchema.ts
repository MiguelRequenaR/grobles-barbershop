import { z } from 'zod';

export const authSchema = z.object({
  email: z.string()
    .min(1, { message: 'El correo es requerido' })
    .email({ message: 'El correo no es válido' }),
  password: z.string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});

export const registerSchema = authSchema.extend({
  shopName: z.string()
    .min(1, { message: 'El nombre del negocio es requerido' })
    .min(3, { message: 'El nombre debe tener al menos 3 letras' })
    .max(50, { message: 'El nombre es demasiado largo' }),
  email: z.string()
    .min(1, { message: 'El correo es requerido' })
    .email({ message: 'El correo no es válido' }),
  password: z.string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string()
    .min(1, { message: 'Debes confirmar la contraseña' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type AuthSchema = z.infer<typeof authSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
