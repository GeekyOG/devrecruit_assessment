/**
 * @swagger
 * components:
 *   schemas:
 *     Books:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The Author
 *         isbn:
 *           type: string
 *           description: ISBN number
 *         publicationDate:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *
 */
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register user
 *     description:  Register with username and password.
 *
 *     tags: [register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful response
 *
 *
 * /api/login:
 *   post:
 *     summary: Login User
 *     description: Login with username and password.
 *
 *     tags: [login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *
 *     responses:
 *       200:
 *         description: Successful response
 *
 *
 * /api/books:
 *   parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *   get:
 *     summary: Get protected resource
 *     description: Retrieve a protected resource that requires authorization. provide offset and page query to paginate
 *     tags: [Books]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Authorization token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *
 * tags:
 *   name: Books
 *   description: The books managing API
 * /api/book:
 *   parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ISBN
 *             properties:
 *               ISBN:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       500:
 *         description: Some server error
 *
 * /api/book?isbn={ISBN}:
 *   get:
 *     summary: get book by isbn
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: ISBN
 *         schema:
 *           type: integer
 *
 *
 *
 *
 *
 *
 *
 * /book/{id}:
 *   parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in : path
 *         name: id
 *
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book response by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: The book was not found
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Books'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Books'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

const express = require("express");
const { User } = require("./UserModel");
const createTables = require("./createTable");
const authenticateUser = require("./middleware");
const { Book } = require("./Bookmodels");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 8080;

createTables();

app.use(express.json());

async function fetchBookDetailsByISBN(isbn) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
    );
    const bookData = response.data[`ISBN:${isbn}`];
    return bookData;
  } catch (error) {
    return error.message;
  }
}

// register user
app.post(
  "/api/register",
  [
    // Validate input fields
    body("username").notEmpty(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "username and password fields required" });
    }

    const { username, password } = req.body;
    const user = new User(username, password);
    user.save(req, res);
  }
);

// login user
app.post("/api/login", async (req, res) => {
  const user = new User();
  user.login(req, res);
});

app.get("/api/book", async (req, res) => {
  const { isbn } = req.query;
  try {
    fetchBookDetailsByISBN(isbn).then(async (bookDetails) => {
      if (bookDetails == undefined) {
        res.status(404).json({ message: "Invalid ISBN" });
      } else {
        res.status(201).json(bookDetails);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// post a book

app.post("/api/book", authenticateUser, async (req, res) => {
  const userId = req.user.userId;
  const { isbn } = req.body;
  try {
    fetchBookDetailsByISBN(isbn).then(async (bookDetails) => {
      if (bookDetails == undefined) {
        res.status(404).json({ message: "Invalid ISBN" });
      } else {
        const { title, authors, publish_date } = bookDetails;
        const author = authors[0].name;
        const book = new Book(title, author, isbn, publish_date, userId);

        const savedBook = await book.save(res);

        res.status(201).json(savedBook);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List books
app.get("/api/books", authenticateUser, async (req, res) => {
  const books = new Book();
  books.findAll(req, res);
});

// get a single book
app.get("/api/book/:id", authenticateUser, async (req, res) => {
  const books = new Book();
  books.findById(req, res);
});

// Update a book
app.put("/api/book/:id", async (req, res) => {
  const books = new Book();
  books.update(req, res);
});

// Delete a book
app.delete("/api/book/:id", authenticateUser, async (req, res) => {
  const book = new Book();
  book.deleteById(req, res);
});

// Swagger Documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API with NodeJs",
      version: "0.1.0",
      description:
        "This is a simple Book API application made with NodeJs Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["*.js"],
};

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
