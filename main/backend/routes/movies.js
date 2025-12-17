import express from "express";
import {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetails,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/popular", getPopularMovies);

router.get("/now-playing", getNowPlayingMovies);

router.get("/:id", getMovieDetails);


export default router;
