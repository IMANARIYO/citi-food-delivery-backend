import Order from "../models/Order.js";
import deliverOrder from "../controllers/ordersSpecialfunctions.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const orderRouter = express.Router();
orderRouter.use(verifyingtoken);
orderRouter.post('/create-order', createModelHandler(Order));
orderRouter.get('/get-order', readModelHandler(Order));
orderRouter.get('/get-order-by-id/:id', readModelHandler(Order));
orderRouter.put('/edit-order-by-id/:id', updateModelHandler(Order));
orderRouter.delete('/delete-order-by-id/:id', deleteModelHandler(Order));
orderRouter.patch('/deliver/order-id/:id', deliverOrder);

export default orderRouter;