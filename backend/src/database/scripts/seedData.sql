INSERT INTO roles (name, description) 
VALUES 
    ('admin', 'Administrator role'),
    ('user', 'Regular user role')
ON CONFLICT (name) DO NOTHING;

INSERT INTO space_types (name, description)
VALUES 
    ('desk', 'Individual desk'),
    ('office', 'Private office'),
    ('meeting_room', 'Meeting room')
ON CONFLICT (name) DO NOTHING;

INSERT INTO contact_types (name)
VALUES 
    ('phone'),
    ('email')
ON CONFLICT (name) DO NOTHING; 