CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL DEFAULT 'user',
    created_at timestamp NOT NULL DEFAULT now()
);
