import express from 'express';
import { register, login, deleteUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * Käyttäjän rekisteröintipyyntö
 * Vastaanottaa POST-pyynnön polkuun /register
 * @body { email, displayName, password } JSON-muotoinen käyttäjätiedot
 * Palauttaa onnistumis- tai virheviestin JSON-muodossa
 */
router.post('/register', register);

/**
 * Käyttäjän kirjautumispyyntö
 * Vastaanottaa POST-pyynnön polkuun /login
 * @body { email, password } JSON-muotoinen kirjautumistiedot
 * Palauttaa onnistumis- tai virheviestin JSON-muodossa
 */
router.post('/login', login);

router.delete('/:id', deleteUser);

export default router;
