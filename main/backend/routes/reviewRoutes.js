import express from 'express';
import { addReview, getReviewsByMovie, getAverageRating, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

/**
 * Lisää arvostelu
 * POST /api/reviews
 */
router.post('/', addReview);

/**
 * Hae arvostelun keskiarvo elokuvalle
 * GET /api/reviews/movie/:tmdbId/average
 */
router.get('/movie/:tmdbId/average', getAverageRating);

/**
 * Hae kaikki arvostelut elokuvalle
 * GET /api/reviews/movie/:tmdbId
 */
router.get('/movie/:tmdbId', getReviewsByMovie);

/**
 * Poista arvostelu
 * DELETE /api/reviews/:reviewId
 */
router.delete('/:reviewId', deleteReview);

export default router;
