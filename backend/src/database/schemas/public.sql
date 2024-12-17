CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE public.tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    schema_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.system_admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.tenant_operations_log (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES system_admins(id),
    tenant_id INTEGER REFERENCES tenants(id),
    operation_type VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 