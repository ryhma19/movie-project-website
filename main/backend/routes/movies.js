import express from 'express';
import { searchMovies } from '../controllers/movieController.js';

const router = express.Router();

/**
 * Julkinen API päätepiste elokuvien hakuun
 * GET /api/movies/search?query=hakusana
 * Ei vaadi kirjautumista eli kuka tahansa voi hakea elokuvia
 */
router.get('/movies/search', async (req, res) => {
  // Luetaan hakusana URL parametreista (?query=...)
  const { query } = req.query;

  // Tarkistetaan että hakusana on annettu
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter is required'
    });
  }

  // Kutsutaan kontrolleri funktiota joka tekee tietokantahaun
  const result = await searchMovies(query);
  
  // Palautetaan tulokset JSON muodossa
  res.json(result);
});

export default router;