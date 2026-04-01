const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db', 'people.db');

app.use(cors());
app.use(express.json());

// --- Database setup ---
let db;

async function initDb() {
  const SQL = await initSqlJs();

  // Load existing database file, or create a new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      dob TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDb();
}

function saveDb() {
  const data = db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

// --- Routes ---

// GET /people
app.get('/people', (req, res) => {
  const people = all('SELECT * FROM people ORDER BY created_at DESC');
  res.json(people);
});

// POST /people
app.post('/people', (req, res) => {
  const { name, dob, address } = req.body;
  if (!name || !dob || !address) {
    return res.status(400).json({ error: 'Name, DOB, and address are required' });
  }
  run('INSERT INTO people (name, dob, address) VALUES (?, ?, ?)', [name, dob, address]);
  const rows = all('SELECT * FROM people ORDER BY id DESC LIMIT 1');
  res.status(201).json(rows[0]);
});

// PUT /people/:id
app.put('/people/:id', (req, res) => {
  const { name, dob, address } = req.body;
  const { id } = req.params;
  if (!name || !dob || !address) {
    return res.status(400).json({ error: 'Name, DOB, and address are required' });
  }
  run('UPDATE people SET name = ?, dob = ?, address = ? WHERE id = ?', [name, dob, address, id]);
  const rows = all('SELECT * FROM people WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Person not found' });
  res.json(rows[0]);
});

// DELETE /people/:id
app.delete('/people/:id', (req, res) => {
  const before = all('SELECT * FROM people WHERE id = ?', [req.params.id]);
  if (!before.length) return res.status(404).json({ error: 'Person not found' });
  run('DELETE FROM people WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// --- Start ---
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`PeopleHub API running on http://localhost:${PORT}`);
  });
});
