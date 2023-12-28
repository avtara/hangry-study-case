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