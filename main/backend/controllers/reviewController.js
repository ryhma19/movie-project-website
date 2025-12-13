import { pool } from '../src/db.js';

/**
 * Lisää uuden arvostelun elokuvalle
 * POST /api/reviews
 * Body: { userId, tmdbId, rating, body }
 */
export async function addReview(req, res) {
  const { userId, tmdbId, rating, body } = req.body;

  if (!userId || !tmdbId || !rating || !body) {
    return res.status(400).json({ message: 'userId, tmdbId, rating, and body are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Tarkista ensin, onko media jo olemassa media-taulussa
    let mediaResult = await pool.query(
      'SELECT id FROM media WHERE tmdb_id = $1 AND kind = $2',
      [tmdbId, 'movie']
    );

    let mediaDbId;

    if (mediaResult.rows.length === 0) {
      // Jos mediaa ei ole, lisätään se ensin (ilman title ja posterPath, ne voidaan päivittää myöhemmin)
      const insertMedia = await pool.query(
        'INSERT INTO media (tmdb_id, kind) VALUES ($1, $2) RETURNING id',
        [tmdbId, 'movie']
      );
      mediaDbId = insertMedia.rows[0].id;
    } else {
      mediaDbId = mediaResult.rows[0].id;
    }

    // Tarkista, onko käyttäjä jo arvostellut tämän elokuvan
    const existingReview = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND media_id = $2',
      [userId, mediaDbId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Lisää arvostelu
    const result = await pool.query(
      `INSERT INTO reviews (user_id, media_id, rating, body) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_id, media_id, rating, body, created_at`,
      [userId, mediaDbId, rating, body]
    );

    res.status(201).json({ success: true, review: result.rows[0] });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Failed to add review' });
  }
}

/**
 * Hae kaikki arvostelut elokuvalle
 * GET /api/reviews/movie/:tmdbId
 */
export async function getReviewsByMovie(req, res) {
  const { tmdbId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.id, r.user_id, r.rating, r.body, r.created_at, u.display_name
       FROM reviews r
       JOIN media m ON r.media_id = m.id
       JOIN users u ON r.user_id = u.id
       WHERE m.tmdb_id = $1
       ORDER BY r.created_at DESC`,
      [tmdbId]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ message: 'Failed to get reviews' });
  }
}

/**
 * Hae arvostelun keskiarvo elokuvalle
 * GET /api/reviews/movie/:tmdbId/average
 */
export async function getAverageRating(req, res) {
  const { tmdbId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as count,
        ROUND(AVG(rating)::numeric, 1) as average
       FROM reviews r
       JOIN media m ON r.media_id = m.id
       WHERE m.tmdb_id = $1`,
      [tmdbId]
    );

    const { count, average } = result.rows[0];
    res.status(200).json({ 
      count: parseInt(count), 
      average: parseFloat(average) || 0 
    });
  } catch (err) {
    console.error('Get average rating error:', err);
    res.status(500).json({ message: 'Failed to get average rating' });
  }
}

/**
 * Poista arvostelu
 * DELETE /api/reviews/:reviewId
 */
export async function deleteReview(req, res) {
  const { reviewId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // Tarkista, että arvostelun omistaja poistetaan
    const review = await pool.query(
      'SELECT user_id FROM reviews WHERE id = $1',
      [reviewId]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.rows[0].user_id !== parseInt(userId)) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
}
