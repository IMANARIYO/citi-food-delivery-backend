import Restaurant from "../models/restoutantprofile.js";
import express from "express";

Restaurant
const RestaurantRouter = express.Router();

// Create or update the restaurant profile
RestaurantRouter.post('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate({}, req.body, { upsert: true, new: true, runValidators: true });
    res.status(201).send(restaurant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get the restaurant profile
RestaurantRouter.get('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update the restaurant profile
RestaurantRouter.put('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete the restaurant profile
RestaurantRouter.delete('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete();
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default RestaurantRouter;
