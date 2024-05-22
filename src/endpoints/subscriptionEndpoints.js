import express from 'express';
import Subscription from '../models/Subscription.js';
import { createModelHandler, readModelHandler, updateModelHandler, deleteModelHandler } from '../controllers/crud.js';

const subscriptionRouter = express.Router();

subscriptionRouter.post('/', createModelHandler(Subscription));
subscriptionRouter.get('/', readModelHandler(Subscription));
subscriptionRouter.put('/:id', updateModelHandler(Subscription));
subscriptionRouter.delete('/:id', deleteModelHandler(Subscription));

export default subscriptionRouter;