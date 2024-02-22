const pool = require("./pgConfig");
const { createBooksTableQuery, createUserTableQuery } = require("./tables");

const createTables = () => {
  // create books table
  pool
    .query(createBooksTableQuery)
    .then(() => {
      console.log("Table created successfully");
    })
    .catch((error) => {
      console.error("Error occurred while creating table:", error);
    });
  // create users table
  pool
    .query(createUserTableQuery)
    .then(() => {
      console.log("User created successfully");
    })
    .catch((error) => {
      console.error("Error occurred while creating table:", error);
    });
};

module.exports = createTables;
