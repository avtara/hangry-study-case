-- CREATE DATABASE "hangry" WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION
-- LIMIT
--     = -1 IS_TEMPLATE = False;
CREATE TYPE user_role AS ENUM('guest', 'admin', 'superadmin');

CREATE TABLE IF NOT EXISTS users(
    id serial PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    role user_role DEFAULT 'guest',
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_user ON users USING BTREE (id);

INSERT INTO
    public.users (
        id,
        name,
        password,
        email,
        role,
        is_active,
        created_by,
        created_at,
        modified_by,
        modified_at,
        deleted_by,
        deleted_at
    )
VALUES
    (
        1,
        'Admin' :: varchar(255),
        '$2b$10$/kzKtUcxlgQulVIt9s7Evecyj5t88ox2o6GJO9X4k6/yabFjQ0NUi' :: varchar(255),
        'superadmin@hangry.com' :: varchar(255),
        'superadmin' :: user_role,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        null :: varchar(255),
        null :: timestamp
    );

INSERT INTO
    public.users (
        id,
        name,
        password,
        email,
        role,
        is_active,
        created_by,
        created_at,
        modified_by,
        modified_at,
        deleted_by,
        deleted_at
    )
VALUES
    (
        2,
        'Superadmin' :: varchar(255),
        '$2b$10$/kzKtUcxlgQulVIt9s7Evecyj5t88ox2o6GJO9X4k6/yabFjQ0NUi' :: varchar(255),
        'admin' :: varchar(255),
        'admin' :: user_role,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        null :: varchar(255),
        null :: timestamp
    );

CREATE TABLE IF NOT EXISTS stores(
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_store ON stores USING BTREE (id);

INSERT INTO
    public.stores (
        id,
        name,
        latitude,
        longitude,
        is_active,
        created_by,
        created_at,
        modified_by,
        modified_at,
        deleted_by,
        deleted_at
    )
VALUES
    (
        DEFAULT,
        'Hangry Kalibata' :: varchar(255),
        -6.26195265565598 :: numeric(9, 6),
        106.84289561829519 :: numeric(9, 6),
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        null :: varchar(255),
        null :: timestamp
    );

INSERT INTO
    public.stores (
        id,
        name,
        latitude,
        longitude,
        is_active,
        created_by,
        created_at,
        modified_by,
        modified_at,
        deleted_by,
        deleted_at
    )
VALUES
    (
        DEFAULT,
        'Hangry Tebet' :: varchar(255),
        -6.238598647035045 :: numeric(9, 6),
        106.86222270772872 :: numeric(9, 6),
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        DEFAULT,
        null :: varchar(255),
        null :: timestamp
    );

CREATE TABLE IF NOT EXISTS menus(
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(9, 2) NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);
CREATE INDEX idx_menu ON menus USING BTREE (id);

INSERT INTO public.menus (id, name, price, image, description, is_active, created_by, created_at, modified_by,
                          modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 'Moon Chicken - Paha'::varchar(255), 21000.00::numeric(9, 2),
        'https://res.cloudinary.com/dgsgylfvr/image/upload/f_auto/v1/moon-chicken-website/home-about-gallery-1?_a=ATABlAA0'::text,
        'Ayam dari Galaxy Bima Sakti dipadukan dengan bumbu korea', DEFAULT, DEFAULT, DEFAULT, DEFAULT,
        DEFAULT, null::varchar(255), null::timestamp);

INSERT INTO public.menus (id, name, price, image, description, is_active, created_by, created_at, modified_by,
                          modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 'Moon Chicken - Dada'::varchar(255), 25000.00::numeric(9, 2),
        'https://res.cloudinary.com/dgsgylfvr/image/upload/f_auto/v1/moon-chicken-website/home-about-gallery-2?_a=ATABlAA0'::text,
        'Ayam dari Galaxy Bima Sakti dipadukan dengan bumbu korea', DEFAULT, DEFAULT, DEFAULT, DEFAULT,
        DEFAULT, null::varchar(255), null::timestamp);

INSERT INTO public.menus (id, name, price, image, description, is_active, created_by, created_at, modified_by,
                          modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 'Moon Chicken - Combo'::varchar(255), 42000.00::numeric(9, 2),
        'https://res.cloudinary.com/dgsgylfvr/image/upload/f_auto/v1/moon-chicken-website/home-about-gallery-3?_a=ATABlAA0'::text,
        'Combo Ayam isi 2 dari Galaxy Bima Sakti dipadukan dengan bumbu korea', DEFAULT, DEFAULT,
        DEFAULT, DEFAULT, DEFAULT, null::varchar(255), null::timestamp);

CREATE TABLE IF NOT EXISTS store_menus(
    id serial PRIMARY KEY,
    menu_id INT,
    store_id INT,
    availability BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);
CREATE INDEX idx_store_menu ON store_menus USING BTREE (id);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 1::integer, 1::integer, true::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, null::varchar(255),
        null::timestamp);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 1::integer, 2::integer, false::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
        null::varchar(255), null::timestamp);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 2::integer, 1::integer, true::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, null::varchar(255),
        null::timestamp);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 2::integer, 2::integer, true::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, null::varchar(255),
        null::timestamp);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 3::integer, 1::integer, true::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, null::varchar(255),
        null::timestamp);

INSERT INTO public.store_menus (id, menu_id, store_id, availability, is_active, created_by, created_at, modified_by,
                                modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 3::integer, 2::integer, false::boolean, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
        null::varchar(255), null::timestamp);

CREATE TYPE cart_status AS ENUM('active', 'checked_out');

CREATE TABLE IF NOT EXISTS carts(
    id serial PRIMARY KEY,
    user_id INT,
    status cart_status DEFAULT 'active',
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);
CREATE INDEX idx_cart ON carts USING BTREE (id);

INSERT INTO public.carts (id, user_id, status, is_active, created_by, created_at, modified_by, modified_at, deleted_by,
                          deleted_at)
VALUES (DEFAULT, 1::integer, 'active'::cart_status, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, null::varchar(255),
        null::timestamp);


CREATE TABLE IF NOT EXISTS cart_items(
    id serial PRIMARY KEY,
    cart_id INT,
    menu_id INT,
    quantity INT,
    price DECIMAL(9,2),
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    created_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    modified_by VARCHAR(255) DEFAULT 'SYSTEM' :: CHARACTER VARYING NOT NULL,
    modified_at TIMESTAMP(0) DEFAULT NOW() NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP
);
CREATE INDEX idx_cart_item ON cart_items USING BTREE (id);

INSERT INTO public.cart_items (id, cart_id, menu_id, quantity, price, is_active, created_by, created_at, modified_by,
                               modified_at, deleted_by, deleted_at)
VALUES (DEFAULT, 1::integer, 1::integer, 1::integer, 21000.00::numeric(9, 2), DEFAULT, DEFAULT, DEFAULT, DEFAULT,
        DEFAULT, null::varchar(255), null::timestamp);

