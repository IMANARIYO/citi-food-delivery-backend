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
fooditemRouter.put('/foodItem/:id/discount', async (req, res) => {
  try {
    const { discount } = req.body;
    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: 'Invalid discount value' });
    }

    const item = await foodItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Store original price if not already stored
    if (!item.originalPrice) {
      item.originalPrice = item.price;
    }

    // Update the discount and the price
    item.discount = discount;
    const discountedPrice = item.originalPrice * (1 - discount / 100);
    item.price = discountedPrice.toFixed(2); // Adjust the price based on the discount

    await item.save();
    res.status(200).json({ message: 'Discount applied successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Remove discount from a food item and restore original price
fooditemRouter.put('/foodItem/:id/remove-discount', async (req, res) => {
  try {
    const item = await foodItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Restore the original price
    if (item.originalPrice) {
      item.price = item.originalPrice;
      item.originalPrice = undefined;
    }

    // Remove the discount
    item.discount = 0;

    await item.save();
    res.status(200).json({ message: 'Discount removed successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
export default fooditemRouter
