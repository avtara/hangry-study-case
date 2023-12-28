import { z } from 'zod';

export const ConfigModelSchema = z.object({
  port: z.coerce.number().safe().positive(),
  db_user: z.string().min(1),
  db_pass: z.string().min(1),
  db_host: z.string().min(1),
  db_port: z.coerce.number().safe().positive(),
  db_name: z.string().min(1),
});

export type ConfigModel = z.infer<typeof ConfigModelSchema>;

export type EnvironmentVars = keyof ConfigModel;
