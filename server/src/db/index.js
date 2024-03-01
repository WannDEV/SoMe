import pkg from "pg";
const { Pool } = pkg;

// Lav en PostgreSQL pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "social_media",
  password: "postgres123",
  port: 5432, // Standard PostgreSQL port
});

// Eksporter pool'en så den kan deles over flere moduler
export default pool;
