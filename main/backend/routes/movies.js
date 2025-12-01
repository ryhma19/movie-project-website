import express from "express";
import {
  getPopularMovies,
  getNowPlayingMovies,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/popular", getPopularMovies);

router.get("/now-playing", getNowPlayingMovies);

export default router;
