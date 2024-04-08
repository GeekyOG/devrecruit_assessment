const { Pool } = require("pg");

const pool = new Pool({
  host: "ep-solitary-fog-a4kqgbsx-pooler.us-east-1.aws.neon.tech",
  port: 5432,
  user: "default",
  password: "IqFlsiVUj1t9",
  database: "verceldb",
});

module.exports = pool;
