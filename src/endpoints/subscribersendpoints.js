import Subscriber from "../models/subscribers.js";
import Subscription from "../models/Subscription.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const subscribersRouter = express.Router();
// subscribersRouter.use(verifyingtoken);
subscribersRouter.post('/subscribefor/:subscriptionId', createModelHandler(Subscriber));
subscribersRouter.get('/get-all', readModelHandler(Subscriber));
subscribersRouter.put('/getby-id/:id', updateModelHandler(Subscriber));
subscribersRouter.delete('/delete/:id', deleteModelHandler(Subscriber));

export default subscribersRouter;