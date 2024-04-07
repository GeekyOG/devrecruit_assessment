const pool = require("./pgConfig");
const { createBooksTableQuery, createUserTableQuery } = require("./tables");

const createTables = (res) => {
  // create books table
  pool
    .query(createBooksTableQuery)
    .then(() => {
      res.status(201).send("Table created successfully");
    })
    .catch((error) => {
      console.log(error, 0);
    });
  // create users table
  pool
    .query(createUserTableQuery)
    .then(() => {
      res.status(201).send("User created successfully");
    })
    .catch((error) => {
      console.log(error, "k");
    });
};

module.exports = createTables;
