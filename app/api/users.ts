import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: 'postgresql://skushagra.sharma:iK7OJTocY3Ry@ep-hidden-feather-21393257.us-east-2.aws.neon.tech/users?sslmode=require',
  ssl: {
    rejectUnauthorized: false, // Set to true for production
  },
});

app.use(express.json());

app.get('/api/users', async (req: Request, res: Response) => {
  console.log("Hello")
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } finally {
    client.release();
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;

  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
