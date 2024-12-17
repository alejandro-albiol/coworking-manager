CREATE TYPE space_status AS ENUM ('available', 'occupied', 'maintenance', 'inactive');

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE contact_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type_id INTEGER REFERENCES contact_types(id),
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE space_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_id INTEGER REFERENCES space_types(id),
    capacity INTEGER,
    price_per_hour NUMERIC(10,2),
    price_per_day NUMERIC(10,2),
    price_per_month NUMERIC(10,2),
    description TEXT,
    status space_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE space_prices_history (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id),
    price_per_hour NUMERIC(10,2),
    price_per_day NUMERIC(10,2),
    price_per_month NUMERIC(10,2),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id),
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE booking_resources (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    resource_id INTEGER REFERENCES resources(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    booking_id INTEGER REFERENCES bookings(id),
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id),
    reported_by INTEGER REFERENCES users(id),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

INSERT INTO roles (name, description) 
VALUES 
    ('admin', 'Administrator role'),
    ('user', 'Regular user role')
ON CONFLICT (name) DO NOTHING; 