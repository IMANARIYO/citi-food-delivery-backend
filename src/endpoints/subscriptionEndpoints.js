import Subscription from "../models/Subscription.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";

const subscriptionRouter = express.Router();

subscriptionRouter.post('/create-subscription', createModelHandler(Subscription));
subscriptionRouter.get('/get-all', readModelHandler(Subscription));
subscriptionRouter.put('/getby-id/:id', updateModelHandler(Subscription));
subscriptionRouter.delete('/delete/:id', deleteModelHandler(Subscription));

export default subscriptionRouter;