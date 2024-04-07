const { Pool } = require("pg");

const pool = new Pool({
  host: "srv1005.hstgr.io",
  port: 5432,
  user: "u556650680_crypto_fleet",
  password: "Crypto_fleet1.",
  database: "u556650680_crypto_fleet",
});

module.exports = pool;
