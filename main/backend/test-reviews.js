import { pool } from './src/db.js';

async function testReviews() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0].now);
    
    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('media', 'reviews', 'users')
    `);
    console.log('Available tables:', tables.rows.map(row => row.table_name));
    
    // Check if there are any users
    const users = await pool.query('SELECT id, display_name FROM users LIMIT 3');
    console.log('Sample users:', users.rows);
    
    // Check if there are any media records
    const media = await pool.query('SELECT id, tmdb_id, title FROM media LIMIT 3');
    console.log('Sample media:', media.rows);
    
    // Check if there are any reviews
    const reviews = await pool.query(`
      SELECT r.id, r.user_id, r.media_id, r.rating, r.body, r.created_at, 
             u.display_name, m.tmdb_id, m.title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN media m ON r.media_id = m.id
      LIMIT 3
    `);
    console.log('Sample reviews:', reviews.rows);
    
    // Test the exact query used by the controller
    const tmdbId = 550; // Fight Club
    const reviewsByMovie = await pool.query(
      `SELECT r.id, r.user_id, r.rating, r.body, r.created_at, u.display_name
       FROM reviews r
       JOIN media m ON r.media_id = m.id
       JOIN users u ON r.user_id = u.id
       WHERE m.tmdb_id = $1
       ORDER BY r.created_at DESC`,
      [tmdbId]
    );
    console.log(`Reviews for tmdb_id ${tmdbId}:`, reviewsByMovie.rows);
    
  } catch (error) {
    console.error('Error testing reviews:', error);
  } finally {
    await pool.end();
  }
}

testReviews();