const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./pgConfig");

// Define the User model
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Save user
  async save(req, res) {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    try {
      const result = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
        [this.username, hashedPassword]
      );
      const userId = result.rows[0].id;
      res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Error registering user" });
    }
  }

  //login user
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = result.rows[0];

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ userId: user.id }, "your_secret_key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Error logging in user" });
    }
  }
}

module.exports = { User };
