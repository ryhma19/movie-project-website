import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * Käyttäjän rekisteröintipyyntö
 * Vastaanottaa POST-pyynnön polkuun /register
 * @body { email, displayName, password } JSON-muotoinen käyttäjätiedot
 * Palauttaa onnistumis- tai virheviestin JSON-muodossa
 */
router.post('/register', async (req, res) => {
  const { email, displayName, password } = req.body;
  const result = await registerUser(email, displayName, password);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

/**
 * Käyttäjän kirjautumispyyntö
 * Vastaanottaa POST-pyynnön polkuun /login
 * @body { email, password } JSON-muotoinen kirjautumistiedot
 * Palauttaa onnistumis- tai virheviestin JSON-muodossa
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

export default router;
