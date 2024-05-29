import express from "express";
import foodItem from "../models/foodItem.js";
import { uploaded } from "../utils/multer.js";

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  searchFoodItems,
  updateModelHandler
} from '../controllers/crud.js'

const fooditemRouter = express.Router()

fooditemRouter.post('/create', uploaded, createModelHandler(foodItem))
fooditemRouter.get('/get', readModelHandler(foodItem))
fooditemRouter.get('/get/:id', readModelHandler(foodItem))
fooditemRouter.put('/edit/:id', uploaded, updateModelHandler(foodItem))
fooditemRouter.delete('/delete/:id', deleteModelHandler(foodItem))
fooditemRouter.get('/all-food-item-forcategoryid/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // Find food items by category ID
    const foodItems = await foodItem.find({ category: categoryId });

    res.status(200).json({
      status: 'success',
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
});
fooditemRouter.get('/search', searchFoodItems);
export default fooditemRouter
