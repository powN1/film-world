import express from "express";
import * as reviewController from "../controllers/reviewController.js";

const router = express.Router();

// Use like this
router.post("/create-review", reviewController.createReview);
router.post("/get-review", reviewController.getReview);
router.post("/get-reviews-media", reviewController.getReviewsMedia);
router.post("/get-reviews-latest", reviewController.getReviewsLatest);
router.post("/get-reviews-latest-games", reviewController.getReviewsLatestGames);
router.post("/get-reviews-latest-movies", reviewController.getReviewsLatestMovies);
router.post("/get-reviews-latest-series", reviewController.getReviewsLatestSeries);
router.post("/get-reviews-random", reviewController.getReviewsRandom);

export default router;
