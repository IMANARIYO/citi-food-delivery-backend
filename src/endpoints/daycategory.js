import express from "express";
import { DayCategory } from "../models/dayCategory.js";

import {
    createModelHandler,
    deleteModelHandler,
    readModelHandler,
    updateModelHandler
  } from '../controllers/crud.js'
const DayCategoryRouter = express.Router();

// CRUD endpoints
DayCategoryRouter.post('/create-day-categories', createModelHandler(DayCategory));
DayCategoryRouter.get('/get-all-day-categories', readModelHandler(DayCategory));
DayCategoryRouter.get('/getday-category/:id', readModelHandler(DayCategory));
DayCategoryRouter.put('/update-day-category/:id', updateModelHandler(DayCategory));
DayCategoryRouter.delete('/delete-day-category/:id', deleteModelHandler(DayCategory));

export default DayCategoryRouter;
