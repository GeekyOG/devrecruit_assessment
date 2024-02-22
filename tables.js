const createBooksTableQuery = `
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    publication_date VARCHAR(20) NOT NULL,
    userId VARCHAR(255) NOT NULL
);
`;

const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);
`;

module.exports = { createBooksTableQuery, createUserTableQuery };
