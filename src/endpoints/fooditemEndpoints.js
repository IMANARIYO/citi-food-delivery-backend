import express from 'express'
import foodItem from '../models/foodItem.js'
import { uploaded } from '../utils/multer.js'

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'

const fooditemRouter = express.Router()

fooditemRouter.post('/create', uploaded, createModelHandler(foodItem))
fooditemRouter.get('/get', readModelHandler(foodItem))
fooditemRouter.get('/get/:id', readModelHandler(foodItem))
fooditemRouter.put('/edit/:id', uploaded, updateModelHandler(foodItem))
fooditemRouter.delete('/delete/:id', deleteModelHandler(foodItem))

export default fooditemRouter
