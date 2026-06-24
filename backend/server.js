require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const {
    aptitudequestionsEasy,
    aptitudequestionsMedium,
    aptitudequestionsHard,
    reasoningquestionsEasy,
    reasoningquestionsMedium,
    reasoningquestionsHard
} = require("./questions");
const app = express();
require("dotenv").config();

console.log("DATABASE_URL =", process.env.DATABASE_URL ? "FOUND" : "NOT FOUND");
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      user: "postgres",
      host: "localhost",
      database: "Aptimaster",
      password: "7416443425",
      port: 1234,
    });

pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("AptiMaster Backend is Running 🚀");
});
const path = require("path");

app.use(express.static(path.join(__dirname, "..")));

app.get("/questions", async (req, res) => {
    try {
        const { category, level } = req.query;

        const result = await pool.query(
            `SELECT * FROM questions
             WHERE category = $1 AND level = $2
             ORDER BY id`,
            [category, level]
        );

       const questions = result.rows.map(q => ({
    question: q.question,
    options: [
        q.option1,
        q.option2,
        q.option3,
        q.option4
    ],
    answer: q.correct_answer,
    explanation: q.explanation,
    level: q.level
}));

        res.json(questions);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});
app.post("/submit", async (req, res) => {
    try {
        console.log("Submit API called");
        console.log(req.body);

        const { answers, category, level, userId } = req.body;

        const result = await pool.query(
            `SELECT correct_answer
             FROM questions
             WHERE category = $1 AND level = $2
             ORDER BY id`,
            [category, level]
        );

        const questions = result.rows;

        let score = 0;

        for (let i = 0; i < questions.length; i++) {
            if (answers[i] === questions[i].correct_answer) {
                score++;
            }
        }
        await pool.query(
    `INSERT INTO results
    (user_id, score, total_questions, category, level)
    VALUES ($1, $2, $3, $4, $5)`,
    [
        userId,
        score,
        questions.length,
        category,
        level
    ]
);

        res.json({
            score,
            total: questions.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});
let scores = [];

app.post("/save-score", (req, res) => {
    const { name, score } = req.body;

    scores.push({ name, score });

    res.json({ message: "Score saved" });
});

app.get("/scores", (req, res) => {
    res.json(scores);
});


pool.query("SELECT current_database(), current_schema(), version()")
  .then(res => console.log(res.rows))
  .catch(console.error);



app.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

      const hashedPassword = await bcrypt.hash(password, 10);

await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashedPassword]
);
        res.json({
            message: "Registration Successful"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

       const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(401).json({
        message: "Invalid Password"
    });
}

        res.json({
            message: "Login Successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
          } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

if (!process.env.VERCEL) {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
}

module.exports = app;