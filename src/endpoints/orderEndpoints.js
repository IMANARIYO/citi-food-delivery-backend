import Order from "../models/Order.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";

const orderRouter = express.Router();

orderRouter.post('/create', createModelHandler(Order));
orderRouter.get('/get', readModelHandler(Order));
orderRouter.get('/get/:id', readModelHandler(Order));
orderRouter.put('/edit/:id', updateModelHandler(Order));
orderRouter.delete('/delete/:id', deleteModelHandler(Order));

export default orderRouter;