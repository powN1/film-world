import express from "express";
import * as articleController from "../controllers/articleController.js";
import { verifyJWT } from "../utils/jwtFunctions.js";

const router = express.Router();

// Use like this
router.post("/create-article", verifyJWT, articleController.createArticle);
router.post("/get-article", articleController.getArticle);
router.post("/get-articles", articleController.getArticles);
router.post("/get-articles-latest", articleController.getArticlesLatest);
router.post("/get-articles-latest-games", articleController.getArticlesLatestGames);
router.post("/get-articles-latest-movies", articleController.getArticlesLatestMovies);
router.post("/get-articles-latest-series", articleController.getArticlesLatestSeries);

export default router;
