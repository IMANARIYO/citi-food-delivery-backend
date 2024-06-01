import Notification from "../models/Notification.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const notificationRouter = express.Router();

notificationRouter.post('/create', createModelHandler(Notification));
notificationRouter.use(verifyingtoken);
notificationRouter.get('/get/', readModelHandler(Notification));
notificationRouter.get('/get/:id', readModelHandler(Notification));
notificationRouter.put('/edit/:id', updateModelHandler(Notification));
notificationRouter.delete('/delete/:id', deleteModelHandler(Notification));

export default notificationRouter;