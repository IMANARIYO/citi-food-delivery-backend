import express from "express";
import { createDayForWeek } from "../controllers/week&&daycategorycruds.js";
import { weekDay } from "../models/Weekday.js";
import { uploaded } from "../utils/multer.js";

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'

const weeklyMenuRouter = express.Router();

weeklyMenuRouter.post('/createDayForWeek',createDayForWeek);
weeklyMenuRouter.get('/get', readModelHandler(weekDay));
weeklyMenuRouter.get('/get/:id', readModelHandler(weekDay));
weeklyMenuRouter.put('/edit/:id',updateModelHandler(weekDay));
weeklyMenuRouter.delete('/delete/:id', deleteModelHandler(weekDay));

export default weeklyMenuRouter;
