-- Docker entrypoint bootstrap script.
-- This file is executed automatically by Postgres only on first container initialization.
-- Canonical schema is maintained in schema.sql.

\echo 'Applying canonical schema from schema.sql'
\i /docker-entrypoint-initdb.d/02-schema.sql

-- NOTE:
-- Seed data is intentionally not auto-loaded here to keep docker/dev/ci consistent.
-- Run seed manually when demo/sample data is needed:
--   psql -U postgres -d productivity -f /docker-entrypoint-initdb.d/03-seed.sql
