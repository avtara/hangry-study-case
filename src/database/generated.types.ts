import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = "admin" | "guest" | "superadmin";

export interface Stores {
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  id: Generated<number>;
  is_active: Generated<boolean>;
  latitude: Numeric;
  longitude: Numeric;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  name: string;
}

export interface Users {
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  email: string;
  id: Generated<number>;
  is_active: Generated<boolean>;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  name: string;
  password: string;
  role: Generated<UserRole | null>;
}

export interface DB {
  stores: Stores;
  users: Users;
}
