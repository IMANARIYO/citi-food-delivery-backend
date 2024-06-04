import Cart from "../models/Cart.js";
import express from "express";
import { addToCartHandler, checkoutHandler, getCartHandler, removeFromCartHandler, updateCartHandler } from "../controllers/cartScreen.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const cartRouter = express.Router();

cartRouter.use(verifyingtoken);
cartRouter.post('/add-to-cart/:foodItemId', addToCartHandler);
cartRouter.put('/update-cart/:foodItemId', updateCartHandler);
cartRouter.delete('/remove-from-cart/:foodItemId',removeFromCartHandler);
cartRouter.post('/checkout', checkoutHandler);
cartRouter.get('/getall', getCartHandler)
export default cartRouter;
