import Review from "../models/Review.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";

const reviewRouter = express.Router();

reviewRouter.post('/create-review/foodItem', createModelHandler(Review));
reviewRouter.get('/reviews/:id', readModelHandler(Review)); // get all reviews for a specific food item
reviewRouter.get('/reviews/:id', readModelHandler(Review)); // get all reviews for a specific food item
reviewRouter.put('/:id', updateModelHandler(Review));
reviewRouter.delete('/:id', deleteModelHandler(Review));

export default reviewRouter;