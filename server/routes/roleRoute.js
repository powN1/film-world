import express from "express";
import * as roleController from "../controllers/roleController.js";

const router = express.Router();

router.post("/get-roles", roleController.getRoles);
router.post("/get-roles-movie", roleController.getRolesMovie);
router.post("/get-roles-movie-top-rated", roleController.getRolesMovieTopRated);
router.post("/get-roles-movie-top-rated-female", roleController.getRolesMovieTopRatedFemale);
router.post("/get-roles-movie-top-rated-male", roleController.getRolesMovieTopRatedMale);
router.post("/get-roles-serie", roleController.getRolesSerie);
router.post("/get-roles-serie-top-rated", roleController.getRolesSerieTopRated);
router.post("/get-roles-serie-top-rated-female", roleController.getRolesSerieTopRatedFemale);
router.post("/get-roles-serie-top-rated-male", roleController.getRolesSerieTopRatedMale);

export default router;
