import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";
const app = express();
const port = 3000;
env.config();
app.use(express.json()); // ✅ Parses JSON body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();
let books = [];
const getBooks = async () => {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC");
  // console.log(result.rows);
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
app.get("/dashboard", async (req, res) => {
  try {
    books = await getBooks();
    console.log(books);
    res.json(books);
  } catch (error) {
    console.error("Database error:", error);
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

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, review, rating } = req.body;

    const result = await db.query(
      "UPDATE books SET name=$1, author=$2, review=$3, rating=$4 WHERE id=$5 RETURNING *",
      [name, author, review, rating, id]
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
app.post("/add", async (req, res) => {
  const { name, author, review, rating, keyType, key } = req.body;
  const url = getCover(keyType, key);
  const result = await db.query(`SELECT * FROM books WHERE name=$1`, [name]);
  if (result.rows.length > 0) {
    return res
      .status(409)
      .json({ error: "Book already exists in the database!" });
  } else {
    try {
      await db.query(
        `INSERT INTO books (name,author,review,rating,cover) VALUES ($1,$2,$3,$4,$5)`,
        [name, author, review, rating, url]
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
  const { email,uid  } = req.body;
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
}});
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the book exists
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ error: "Book does not exist in the database!" });
    }

    // Delete the book
    await db.query("DELETE FROM books WHERE id = $1", [id]);

    res.status(200).json({ message: "Book deleted successfully!" }); // ✅ Proper success response
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
