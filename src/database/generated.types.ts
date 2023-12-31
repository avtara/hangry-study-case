import type { ColumnType } from "kysely";

export type CartStatus = "active" | "checked_out" | "inactive";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type OrderStatus = "cancelled" | "delivered" | "processing";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = "admin" | "guest" | "superadmin";

export interface CartItems {
  cart_id: number | null;
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  id: Generated<number>;
  is_active: Generated<boolean>;
  menu_id: number | null;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  price: Numeric | null;
  quantity: number | null;
}

export interface Carts {
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  id: Generated<number>;
  is_active: Generated<boolean>;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  status: Generated<CartStatus | null>;
  store_id: number | null;
  user_id: number | null;
}

export interface Menus {
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  description: string;
  id: Generated<number>;
  image: string;
  is_active: Generated<boolean>;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  name: string;
  price: Numeric;
}

export interface Orders {
  cart_id: number | null;
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  id: Generated<number>;
  is_active: Generated<boolean>;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  order_date: Generated<Timestamp>;
  status: Generated<OrderStatus | null>;
  total_amount: Numeric | null;
  user_id: number | null;
}

export interface StoreMenus {
  availability: Generated<boolean | null>;
  created_at: Generated<Timestamp>;
  created_by: Generated<string>;
  deleted_at: Timestamp | null;
  deleted_by: string | null;
  id: Generated<number>;
  is_active: Generated<boolean>;
  menu_id: number | null;
  modified_at: Generated<Timestamp>;
  modified_by: Generated<string>;
  store_id: number | null;
}

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
  cart_items: CartItems;
  carts: Carts;
  menus: Menus;
  orders: Orders;
  store_menus: StoreMenus;
  stores: Stores;
  users: Users;
}
