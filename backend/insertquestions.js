const { Pool } = require("pg");

const {
  aptitudequestionsEasy,
  aptitudequestionsMedium,
  aptitudequestionsHard,
  reasoningquestionsEasy,
  reasoningquestionsMedium,
  reasoningquestionsHard
} = require("./questions");

require("dotenv").config();
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: "PASTE_YOUR_NEON_CONNECTION_STRING_HERE",
  ssl: {
    rejectUnauthorized: false,
  },
});
async function insertQuestions() {
  const allQuestions = [
    ...aptitudequestionsEasy.map(q => ({ ...q, category: "aptitude" })),
    ...aptitudequestionsMedium.map(q => ({ ...q, category: "aptitude" })),
    ...aptitudequestionsHard.map(q => ({ ...q, category: "aptitude" })),
    ...reasoningquestionsEasy.map(q => ({ ...q, category: "reasoning" })),
    ...reasoningquestionsMedium.map(q => ({ ...q, category: "reasoning" })),
    ...reasoningquestionsHard.map(q => ({ ...q, category: "reasoning" }))
  ];
const result = await pool.query("SELECT current_database()");
console.log(result.rows);

const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
console.log(tables.rows);
  for (const q of allQuestions) {
    await pool.query(
      `INSERT INTO questions
    (category, level, question, option1, option2, option3, option4, correct_answer, explanation)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
     [
    q.category,
    q.level,
    q.question,
    q.options[0],
    q.options[1],
    q.options[2],
    q.options[3],
    q.answer,
    q.explanation
]
    );
  }

  console.log("✅ All Questions Inserted Successfully");
  await pool.end();
}

insertQuestions();