import Category from "../models/Category.js";
import express from "express";
import { verifyingtoken } from "../utils/jwtfunctions.js";
import { uploaded } from "../utils/multer.js";

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'

const categoryRouter = express.Router()

categoryRouter.get('/get', readModelHandler(Category))
categoryRouter.get('/get/:id', readModelHandler(Category))
categoryRouter.use(verifyingtoken)
categoryRouter.post('/create', uploaded, createModelHandler(Category))
categoryRouter.put('/edit/:id', uploaded, updateModelHandler(Category))
categoryRouter.delete('/delete/:id', deleteModelHandler(Category))

export default categoryRouter
