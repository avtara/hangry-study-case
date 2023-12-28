import { z } from 'zod';

export const ConfigModelSchema = z.object({
  port: z.coerce.number().safe().positive(),
  db_user: z.string().min(1),
  db_pass: z.string().min(1),
  db_host: z.string().min(1),
  db_port: z.coerce.number().safe().positive(),
  db_name: z.string().min(1),
  frontend_origins: z
    .string()
    .optional()
    .transform((value) => {
      if (process.env.NODE_ENV === 'production') {
        const origins = value ? value.split(',').filter((x) => x !== '') : [];
        return origins;
      }
      return '*';
    }),
  frontend_methods: z
    .string()
    .optional()
    .transform((value) => {
      if (process.env.NODE_ENV === 'production') {
        const methods = value ? value.split(',').filter((x) => x !== '') : [];
        return methods;
      }
      return '*';
    }),
});

export type ConfigModel = z.infer<typeof ConfigModelSchema>;

export type EnvironmentVars = keyof ConfigModel;
