INSERT INTO users (id, email, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'officer@example.org', 'OFFICER')
ON CONFLICT (id) DO NOTHING;

