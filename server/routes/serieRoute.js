import express from "express";
import * as serieController from "../controllers/serieController.js";

const router = express.Router();

// Use like this
router.post("/get-serie", serieController.getSerie);
router.post("/get-series", serieController.getSeries);
router.post("/get-series-by-filters", serieController.getSeriesByFilters);
router.post("/get-series-latest", serieController.getSeriesLatest);
router.post("/get-series-most-anticipated", serieController.getSeriesMostAnticipated);
router.post("/get-series-popular", serieController.getSeriesPopular);
router.post("/get-series-random", serieController.getSeriesRandom);
router.post("/get-series-top-rated", serieController.getSeriesTopRated);
router.post("/get-series-upcoming", serieController.getSeriesUpcoming);

export default router;
