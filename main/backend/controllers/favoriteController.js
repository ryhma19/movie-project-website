import { pool } from '../src/db.js';
import crypto from 'crypto';

/**
 * Lisää elokuva käyttäjän suosikkeihin
 * POST /api/favorites
 * Body: { userId, mediaId, title }
 */
export async function addFavorite(req, res) {
  const { userId, mediaId, title } = req.body;

  if (!userId || !mediaId) {
    return res.status(400).json({ message: 'userId and mediaId are required' });
  }

  try {
    // Tarkista ensin, onko media jo olemassa media-taulussa
    let mediaResult = await pool.query(
      'SELECT id FROM media WHERE tmdb_id = $1 AND kind = $2',
      [mediaId, 'movie']
    );

    let mediaDbId;

    if (mediaResult.rows.length === 0) {
      // Jos mediaa ei ole, lisätään se ensin
      const insertMedia = await pool.query(
        'INSERT INTO media (tmdb_id, kind, title) VALUES ($1, $2, $3) RETURNING id',
        [mediaId, 'movie', title]
      );
      mediaDbId = insertMedia.rows[0].id;
    } else {
      mediaDbId = mediaResult.rows[0].id;
    }

    // Lisätään suosikki favorites-tauluun
    await pool.query(
      'INSERT INTO favorites (user_id, media_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, mediaDbId]
    );

    res.status(201).json({ success: true, message: 'Added to favorites' });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
}

/**
 * Hakee käyttäjän kaikki suosikit
 * GET /api/favorites/:userId
 */
export async function getFavorites(req, res) {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT m.id, m.tmdb_id, m.kind, m.title, f.added_at
       FROM favorites f
       JOIN media m ON f.media_id = m.id
       WHERE f.user_id = $1
       ORDER BY f.added_at DESC`,
      [userId]
    );

    res.status(200).json({ favorites: result.rows });
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ message: 'Failed to get favorites' });
  }
}

/**
 * Poistaa elokuvan käyttäjän suosikeista
 * DELETE /api/favorites/:userId/:mediaId
 */
export async function removeFavorite(req, res) {
  const { userId, mediaId } = req.params;

  try {
    // Haetaan ensin media_id media-taulusta
    const mediaResult = await pool.query(
      'SELECT id FROM media WHERE tmdb_id = $1 AND kind = $2',
      [mediaId, 'movie']
    );

    if (mediaResult.rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const mediaDbId = mediaResult.rows[0].id;

    // Poistetaan suosikki
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND media_id = $2',
      [userId, mediaDbId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
}

/**
 * Luo tai uudistaa jaettavan linkin käyttäjän suosikkilistalle
 * POST /api/favorites/:userId/share
 */
export async function createShareLink(req, res) {
  const { userId } = req.params;

  try {
    const token = crypto.randomBytes(24).toString('hex');

    const result = await pool.query(
      `INSERT INTO favorite_list_shares (user_id, token, enabled)
       VALUES ($1, $2, true)
       ON CONFLICT (user_id)
       DO UPDATE SET token = EXCLUDED.token, enabled = true, created_at = now()
       RETURNING token` ,
      [userId, token]
    );

    return res.status(200).json({ token: result.rows[0].token });
  } catch (err) {
    console.error('Create share link error:', err);
    return res.status(500).json({ message: 'Failed to create share link' });
  }
}

/**
 * Hakee jaetun suosikkilistan tokenin perusteella (ei vaadi kirjautumista)
 * GET /api/favorites/shared/:token
 */
export async function getSharedFavorites(req, res) {
  const { token } = req.params;

  try {
    const share = await pool.query(
      `SELECT user_id FROM favorite_list_shares WHERE token = $1 AND enabled = true`,
      [token]
    );

    if (share.rows.length === 0) {
      return res.status(404).json({ message: 'Shared list not found' });
    }

    const userId = share.rows[0].user_id;

    const result = await pool.query(
      `SELECT m.id, m.tmdb_id, m.kind, m.title, f.added_at
       FROM favorites f
       JOIN media m ON f.media_id = m.id
       WHERE f.user_id = $1
       ORDER BY f.added_at DESC`,
      [userId]
    );

    return res.status(200).json({ favorites: result.rows });
  } catch (err) {
    console.error('Get shared favorites error:', err);
    return res.status(500).json({ message: 'Failed to get shared favorites' });
  }
}
