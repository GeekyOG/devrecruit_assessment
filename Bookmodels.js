const pool = require("./pgConfig");

// Define the Book model
class Book {
  constructor(title, author, isbn, publicationDate, userId) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.userId = userId;
  }

  async save(res) {
    try {
      const query =
        "INSERT INTO books (title, author, isbn, publication_date, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const values = [
        this.title,
        this.author,
        this.isbn,
        this.publicationDate,
        this.userId,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findAll(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.offset);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const userId = req.user.userId;
    try {
      const query = "SELECT * FROM books WHERE userId = $1";
      const { rows } = await pool.query(query, [userId]);
      if (!rows.length) {
        res.status(404).json({ message: "Book with Id does not exist" });
      }
      const result = {};

      if (endIndex < rows.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      result.books = rows.slice(startIndex, endIndex);
      if (req.query.page && req.query.offset) {
        res.json(result);
      } else {
        res.json(rows);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(req, res) {
    const userId = req.user.userId;
    const id = req.params.id;

    try {
      const { rows } = await pool.query(
        "SELECT * FROM books WHERE id = $1 AND userId = $2 ",
        [id, userId]
      );
      if (!rows.length) {
        res.status(404).json({ message: "Book with Id does not exist" });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { title, author, isbn, publicationDate } = req.body;
    const bookId = req.params.id;
    const userId = req.user.userId;
    try {
      const query =
        "UPDATE books SET title = $1, author = $2, isbn = $3, publication_date = $4 WHERE id = $5 AND userId = $6 RETURNING *";
      const values = [title, author, isbn, publicationDate, bookId, userId];
      const { rows } = await pool.query(query, values);
      if (!rows.length)
        return res.status(404).json({ message: "Book not found" });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteById(req, res) {
    const bookId = req.params.id;
    const userId = req.user.userId;
    try {
      const query =
        "DELETE FROM books WHERE id = $1 AND userId = $2 RETURNING *";
      const { rows } = await pool.query(query, [bookId, userId]);
      if (!rows.length)
        return res.status(404).json({ message: "Book not found" });
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = { Book };
