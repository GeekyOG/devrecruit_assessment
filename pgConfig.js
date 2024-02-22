const { Pool } = require("pg");

const pool = new Pool({
  host: "postgres",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "mydatabase",
});

module.exports = pool;
