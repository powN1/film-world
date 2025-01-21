import express from "express";
import { verifyJWT } from "../utils/jwtFunctions.js"
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.post("/add-comment", verifyJWT, commentController.addComment);
router.post("/get-media-comments", commentController.getMediaComments);
router.post("/get-replies", commentController.getReplies);

export default router;
