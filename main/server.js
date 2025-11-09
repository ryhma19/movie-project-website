const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',       
  database: 'movie_database',        
  password: 'root',  
  port: 5432,
});

app.get('/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error); 
    res.status(500).json({
      error: 'Database query failed',
      details: error.message,  
    });
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
