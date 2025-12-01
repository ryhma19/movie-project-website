import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';

const router = express.Router();

/**
 * Lisää elokuva suosikkeihin
 * POST /api/favorites
 * Body: { userId, mediaId, title }
 */
router.post('/', addFavorite);

/**
 * Hae käyttäjän kaikki suosikit
 * GET /api/favorites/:userId
 */
router.get('/:userId', getFavorites);

/**
 * Poista elokuva suosikeista
 * DELETE /api/favorites/:userId/:mediaId
 */
router.delete('/:userId/:mediaId', removeFavorite);

export default router;
