-- schema.sql
DROP TABLE IF EXISTS services;
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
