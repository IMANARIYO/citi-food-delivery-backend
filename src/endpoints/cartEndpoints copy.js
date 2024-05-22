import Cart from "../models/Cart.js";
import express from "express";
import { addToCartHandler, checkoutHandler, removeFromCartHandler, updateCartHandler } from "../controllers/cartScreen.js";

const cartRouter = express.Router();

// Route to add an item to the cart
cartRouter.post('/add-to-cart', async (req, res, next) => {
  await addToCartHandler(req, res, next);
});

// Route to update item quantity in the cart
cartRouter.put('/update-cart', async (req, res, next) => {
  await updateCartHandler(req, res, next);
});

// Route to remove an item from the cart
cartRouter.delete('/remove-from-cart', async (req, res, next) => {
  await removeFromCartHandler(req, res, next);
});
cartRouter.post('/checkout', async (req, res, next) => {
  await checkoutHandler(req, res, next);
});

export default cartRouter;
