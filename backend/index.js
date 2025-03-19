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
const getBooks = async (uid) => { 
  
  const result = await db.query("SELECT * FROM books WHERE uid=$1 ORDER BY id ASC", [uid]);
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
    const {uid} = req.params;
    console.log(uid);
    books = await getBooks(uid);
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

app.put("/update/:uid/:id", async (req, res) => {
  try {
    const { uid, id } = req.params;
    const { name, author, review, rating } = req.body;

    const result = await db.query(
      "UPDATE books SET name=$1, author=$2, review=$3, rating=$4 WHERE id=$5 AND uid= $6 RETURNING *",
      [name, author, review, rating, id, uid]
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
  const { name, author, review, rating, keyType, key, uid } = req.body;
  const url = getCover(keyType, key);
  const result = await db.query(`select * from books where name = $1 and uid=$2`, [name,uid]);
  if (result.rows.length > 0) {
    return res
      .status(409)
      .json({ error: "Book already exists in the database!" });
  } else {
    try {
      await db.query(
        `INSERT INTO books (name,author,review,rating,cover,uid) VALUES ($1,$2,$3,$4,$5,$6)`,
        [name, author, review, rating, url, uid]
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
app.delete("/delete/:uid/:id", async (req, res) => {
  const { uid, id } = req.params;

  try {
    // Check if the book exists
    const result = await db.query("SELECT * FROM books WHERE id = $1 AND uid=$2", [id, uid]);

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
