const pool = require("./pgConfig");
const { createBooksTableQuery, createUserTableQuery } = require("./tables");

const createTables = (res) => {
  // create books table
  pool
    .query(createBooksTableQuery)
    .then(() => {
      console.log("Table created successfully");
    })
    .catch((error) => {
      console.log(error, "success");
    });
  // create users table
  pool
    .query(createUserTableQuery)
    .then(() => {
      console.log("User created successfully");
    })
    .catch((error) => {
      console.log(error, "k");
    });
};

module.exports = createTables;
