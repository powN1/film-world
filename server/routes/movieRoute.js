import express from "express";
import * as movieController from "../controllers/movieController.js";

const router = express.Router();

// Use like this
router.post("/get-movie", movieController.getMovie);
router.post("/get-movies", movieController.getMovies);

router.post("/get-movies-by-filters", movieController.getMoviesByFilters);
router.post("/get-movies-latest", movieController.getMoviesLatest);
router.post("/get-movies-most-anticipated", movieController.getMoviesMostAnticipated);
router.post("/get-movies-random", movieController.getMoviesRandom);
router.post("/get-movies-top-rated", movieController.getMoviesTopRated);
router.post("/get-movies-upcoming", movieController.getMoviesUpcoming);

export default router;
