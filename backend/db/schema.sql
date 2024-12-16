CREATE DATABASE coworking_db;

\c coworking_db;

-- Create public schema for tenant management
CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE public.tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    schema_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create first tenant schema
CREATE SCHEMA IF NOT EXISTS tenant_1;

-- Create enum types
CREATE TYPE tenant_1.space_status AS ENUM ('available', 'occupied', 'maintenance', 'inactive');

-- Create tables in tenant_1 schema
CREATE TABLE tenant_1.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER REFERENCES tenant_1.roles(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE tenant_1.contact_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.user_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tenant_1.users(id),
    type_id INTEGER REFERENCES tenant_1.contact_types(id),
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.space_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_id INTEGER REFERENCES tenant_1.space_types(id),
    capacity INTEGER,
    price_per_hour NUMERIC(10,2),
    price_per_day NUMERIC(10,2),
    price_per_month NUMERIC(10,2),
    description TEXT,
    status tenant_1.space_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE tenant_1.space_prices_history (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES tenant_1.spaces(id),
    price_per_hour NUMERIC(10,2),
    price_per_day NUMERIC(10,2),
    price_per_month NUMERIC(10,2),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.bookings (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES tenant_1.spaces(id),
    user_id INTEGER REFERENCES tenant_1.users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE tenant_1.booking_resources (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES tenant_1.bookings(id),
    resource_id INTEGER REFERENCES tenant_1.resources(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tenant_1.users(id),
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES tenant_1.invoices(id),
    booking_id INTEGER REFERENCES tenant_1.bookings(id),
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES tenant_1.invoices(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_1.maintenance_records (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES tenant_1.spaces(id),
    reported_by INTEGER REFERENCES tenant_1.users(id),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Insert first tenant
INSERT INTO public.tenants (name, subdomain, schema_name) 
VALUES ('Demo Coworking', 'demo', 'tenant_1');
