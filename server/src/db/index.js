import pkg from "pg";
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

// Lav en PostgreSQL pool
const pool = new Pool({
  user: "social_media_api",
  host: "localhost",
  database: "social_media",
  password: process.env.DB_PASSWORD,
  port: 5432, // Standard PostgreSQL port
});

// Eksporter pool'en så den kan deles over flere moduler
export default pool;
