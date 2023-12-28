-- CREATE DATABASE "hangry" WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION
-- LIMIT
--     = -1 IS_TEMPLATE = False;

CREATE TYPE user_role AS ENUM('guest', 'admin');

CREATE TABLE IF NOT EXISTS users(
    id serial PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    photo TEXT,
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

