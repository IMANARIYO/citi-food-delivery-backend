import Payment from "../models/Payment.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";

const paymentRouter = express.Router();

paymentRouter.post('/payfororder/:orderId', createModelHandler(Payment));
paymentRouter.get('/get/:id', readModelHandler(Payment));
paymentRouter.get('/get', readModelHandler(Payment));
paymentRouter.put('/edit/:id', updateModelHandler(Payment));
paymentRouter.delete('/delete/:id', deleteModelHandler(Payment));

paymentRouter.post('/payforsubscription/:subscriptionId', createModelHandler(Payment));

export default paymentRouter;