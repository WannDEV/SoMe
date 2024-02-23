import { Pool } from "pg";

// Lav en PostgreSQL pool
const pool = new Pool({
  user: "your_username",
  host: "your_host",
  database: "social_media",
  password: "your_password",
  port: 5432, // Standard PostgreSQL port
});

// Eksporter pool'en så den kan deles over flere moduler
module.exports = pool;
