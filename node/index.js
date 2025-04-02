const express = require("express");
const app = express();
const { Pool } = require("pg");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

const port = 3000;

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS people (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
};

initDb();

app.get("/", async (req, res) => {
  try {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    const query = "INSERT INTO people (name) VALUES ($1)";
    await pool.query(query, [randomName]);
    const result = await pool.query("SELECT * FROM people");
    res.send(`
      <h1> Full Cycle Rocks!!</h1>
      ${result.rows.map((person) => `<p>${person.name}</p>`).join("")}
    `);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("application started on port", port);
});
