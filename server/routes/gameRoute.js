import express from "express";
import * as gameController from "../controllers/gameController.js";

const router = express.Router();

// Use like this
router.post("/get-game", gameController.getGame);
router.post("/get-games", gameController.getGames);
router.post("/get-games-anticipated", gameController.getGamesAnticipated);
router.post("/get-games-by-filters", gameController.getGamesByFilters);
router.post("/get-games-latest", gameController.getGamesLatest);
router.post("/get-games-random", gameController.getGamesRandom);
router.post("/get-games-top-rated", gameController.getGamesTopRated);
router.post("/get-games-upcoming", gameController.getGamesUpcoming);

export default router;
