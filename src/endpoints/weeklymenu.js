import WeeklyMenu from "../models/WeeklyMenu.js";
import express from "express";
import { uploaded } from "../utils/multer.js";

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'

const weeklyMenuRouter = express.Router();

weeklyMenuRouter.post('/create',createModelHandler(WeeklyMenu));
weeklyMenuRouter.get('/get', readModelHandler(WeeklyMenu));
weeklyMenuRouter.get('/get/:id', readModelHandler(WeeklyMenu));
weeklyMenuRouter.put('/edit/:id',updateModelHandler(WeeklyMenu));
weeklyMenuRouter.delete('/delete/:id', deleteModelHandler(WeeklyMenu));

export default weeklyMenuRouter;
