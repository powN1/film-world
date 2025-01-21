import express from "express";
import * as actorController from "../controllers/actorController.js";

const router = express.Router();

// Use like this
router.post("/get-actor", actorController.getActor);
router.post("/get-actors", actorController.getActors);
router.post("/get-actors-top-rated", actorController.getActorsTopRated);

export default router;
