import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;
env.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

app.use(express.json()); // ✅ Parses JSON body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const db = new pg.Client({
  connectionString: process.env.PG_CONNECTION_STRING,
});

db.connect();
let books = [];
const getBooks = async (uid, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;
  const result = await db.query(
    "SELECT * FROM books WHERE uid = $1 ORDER BY id ASC LIMIT $2 OFFSET $3",
    [uid, limit, offset]
  );
  console.log(result.rows);
  return result.rows;
};

const getCover = (keyType, key) => {
  return `https://covers.openlibrary.org/b/${keyType}/${key}-M.jpg`;
};

app.get("/", async (req, res) => {
  try {
    res.send("hello");
  } catch (error) {
    console.error("some bug");
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/dashboard/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { page = 1, limit = 5, search = "", category = "All", status = "All", sortBy = "rating" } = req.query;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build base query
    let query = "SELECT * FROM books WHERE uid = $1";
    const queryParams = [uid];
    let paramCount = 1;

    // Add search filter if provided
    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(author) LIKE LOWER($${paramCount}))`;
      queryParams.push(`%${search}%`);
    }

    // Add category filter if not "All"
    if (category !== "All") {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    // Add status filter if not "All"
    if (status !== "All") {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    // Add sorting
    switch (sortBy) {
      case "title":
        query += ` ORDER BY name ASC`;
        break;
      case "author":
        query += ` ORDER BY author ASC`;
        break;
      case "rating":
      default:
        query += ` ORDER BY rating DESC NULLS LAST`;
        break;
    }

    // Add pagination
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limit, offset);

    // Execute main query
    const result = await db.query(query, queryParams);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) FROM books WHERE uid = $1";
    const countParams = [uid];
    paramCount = 1;

    if (search) {
      paramCount++;
      countQuery += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(author) LIKE LOWER($${paramCount}))`;
      countParams.push(`%${search}%`);
    }

    if (category !== "All") {
      paramCount++;
      countQuery += ` AND category = $${paramCount}`;
      countParams.push(category);
    }

    if (status !== "All") {
      paramCount++;
      countQuery += ` AND status = $${paramCount}`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      books: result.rows,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/books/count/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    const result = await db.query("SELECT COUNT(*) FROM books WHERE uid = $1", [uid]);
    const totalBooks = parseInt(result.rows[0].count);
    const totalPages = Math.ceil(totalBooks / limit);

    res.json(totalPages); // return number of pages, not just count
  } catch (error) {
    console.error("Count error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/register", async (req, res) => {
  try {
  } catch (error) {}
});
app.get("/getData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await db.query(`SELECT * FROM books WHERE id=${id}`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found!" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/update/:uid/:id", async (req, res) => {
  try {
    const { uid, id } = req.params;
    const { name, author, review, rating, category, status } = req.body;

    const result = await db.query(
      "UPDATE books SET name=$1, author=$2, review=$3, rating=$4, category=$5, status=$6 WHERE id=$7 AND uid= $8 RETURNING *",
      [name, author, review, rating, category, status, id, uid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Book not found!" });
    }

    res.json({
      message: "Book updated successfully!",
      updatedBook: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/add/:uid", async (req, res) => {
  const { name, author, review, rating, keyType, key, category, status, uid } = req.body;
  const url = getCover(keyType, key);
  const result = await db.query(
    `select * from books where name = $1 and uid=$2`,
    [name, uid]
  );
  if (result.rows.length > 0) {
    return res
      .status(409)
      .json({ error: "Book already exists in the database!" });
  } else {
    try {
      await db.query(
        `INSERT INTO books (name,author,review,rating,cover,category,status,uid) VALUES ($1,$2,$3,$4,$5,$6, $7, $8)`,
        [name, author, review, rating, url, category, status, uid]
      );
      res
        .status(201)
        .json({ message: "Book added successfully!", data: req.body });
      // res.redirect("/");
      // console.log(req.body);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
app.post("/register", async (req, res) => {
  const { email, uid } = req.body;
  const result = await db.query(`SELECT * FROM users WHERE uid=$1`, [uid]);
  if (result.rows.length > 0) {
    return res
      .status(409)
      .json({ error: "User already exists in the database!" });
  } else {
    try {
      await db.query("INSERT INTO users (uid,email) VALUES ($1,$2)", [
        uid,
        email,
      ]);
      res
        .status(201)
        .json({ message: "User added successfully!", data: req.body });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
app.delete("/delete/:uid/:id", async (req, res) => {
  const { uid, id } = req.params;

  try {
    // Check if the book exists
    const result = await db.query(
      "SELECT * FROM books WHERE id = $1 AND uid=$2",
      [id, uid]
    );

    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ error: "Book does not exist in the database!" });
    }

    // Delete the book
    await db.query("DELETE FROM books WHERE id = $1 AND uid=$2", [id, uid]);

    res.status(200).json({ message: "Book deleted successfully!" }); // ✅ Proper success response
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put('/user/email', async (req, res) => {
  try {
    const { uid, email } = req.body;
    await db.query('UPDATE users SET email=$1 WHERE uid=$2', [email, uid]);
    res.status(200).json({ message: 'Email updated' });
  } catch (error) {
    console.error("Backend DB Error:", error);
    res.status(500).json({ error: 'Failed to update email in database' });
  }
});

// Delete user
app.delete('/user/delete', async (req, res) => {
  const { uid } = req.body;
  await db.query('DELETE FROM users WHERE uid=$1', [uid]);
  res.status(200).json({ message: 'User deleted' });
});

// Helper function to get user's books for context
const getUserBooks = async (uid) => {
  try {
    const result = await db.query(
      "SELECT name, author, category, status, rating, review FROM books WHERE uid = $1",
      [uid]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching user books:", error);
    return [];
  }
};

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, uid, userBooks, isNewUser } = req.body;

    let context = "";
    if (isNewUser) {
      context = "You are a book recommendation assistant for a new user. ";
      context += "Keep responses brief and concise. ";
      context += "For each recommendation, just mention the book title, author, and one key reason why it's worth reading. ";
      context += "Limit to 2-3 recommendations.";
    } else {
      context = "You are a book recommendation assistant for an existing user. ";
      context += "Here are their current books:\n";
      userBooks.forEach(book => {
        context += `- ${book.name} by ${book.author} (${book.category}, Rating: ${book.rating})\n`;
      });
      context += "\nKeep responses brief and concise. ";
      context += "For each recommendation, just mention the book title, author, and one key reason why it matches their interests. ";
      context += "Limit to 2-3 recommendations.";
    }

    const prompt = `${context}\n\nUser message: ${message}\n\nProvide brief book recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      message: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
