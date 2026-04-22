import express from "express";
import { addReview, removeReview, getReviews, getReviewById } from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.get("/add-review", addReview);
reviewRouter.get("/remove-review", removeReview);
reviewRouter.get("/get-review/:id", getReviewById);

export default reviewRouter;
