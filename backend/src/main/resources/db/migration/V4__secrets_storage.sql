CREATE TABLE application_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL
);
CREATE UNIQUE INDEX application_config_key_uindex ON application_config (key);
