import express from "express";
import { verifyJWT } from "../utils/jwtFunctions.js"
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post("/add-favorite", verifyJWT, userController.addFavorite);
router.post("/add-user-background", verifyJWT, userController.addUserBackground);
router.post("/add-rating", verifyJWT, userController.addRating);
router.post("/add-want-to-see", verifyJWT, userController.addWantToSee);
router.post("/check-rating", verifyJWT, userController.checkRating);
router.post("/check-favorite", verifyJWT, userController.checkFavorite);
router.post("/check-want-to-see", verifyJWT, userController.checkWantToSee);
router.post("/delete-comment", verifyJWT, userController.deleteComment);
router.post("/get-user", userController.getUser);
router.post("/google-auth", userController.googleAuth);
router.post("/facebook-auth", userController.facebookAuth);
router.post("/remove-rating", verifyJWT, userController.removeRating);
router.post("/remove-user-background", verifyJWT, userController.removeUserBackground);
router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);

export default router;
