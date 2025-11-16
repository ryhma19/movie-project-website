import { pool } from '../src/db.js';

/**
 * Hakee elokuvia tietokannasta hakusanan perusteella
 * @param {string} searchQuery - Käyttäjän antama hakusana
 * @returns {Object} - Palauttaa elokuvat, määrän ja onnistumistilan
 */
export async function searchMovies(searchQuery) {
  try {
    // Tarkistetaan että hakusana ei ole tyhjä
    if (!searchQuery || searchQuery.trim() === '') {
      return {
        movies: [],
        count: 0,
        message: 'Search query is empty'
      };
    }

    // SQL-kysely: ILIKE = ei huomioi isoja/pieniä kirjaimia
    // $1 = parametrisoitu kysely (suojaa SQL-injektiolta)
    // %hakusana% = löytää hakusanan mistä tahansa kohdasta otsikkoa
    const query = `
      SELECT id, tmdb_id, kind, title
      FROM media 
      WHERE title ILIKE $1 
      LIMIT 20
    `;

    // Suoritetaan kysely tietokantaan
    const result = await pool.query(query, [`%${searchQuery}%`]);

    // Palautetaan tulokset JSON-muodossa
    return {
      movies: result.rows,
      count: result.rows.length,
      success: true
    };
  } catch (error) {
    // Virhetilanteessa logitetaan virhe ja palautetaan tyhjä tulos
    console.error('Search error:', error);
    return {
      movies: [],
      count: 0,
      success: false,
      error: error.message
    };
  }
}