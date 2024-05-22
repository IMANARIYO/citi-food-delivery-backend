import Category from '../models/Category.js'
import express from 'express'
import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'
import { uploaded } from '../utils/multer.js'

const categoryRouter = express.Router()

categoryRouter.post('/create', uploaded, createModelHandler(Category))
categoryRouter.get('/get', readModelHandler(Category))
categoryRouter.get('/get/:id', readModelHandler(Category))
categoryRouter.put('/edit/:id', uploaded, updateModelHandler(Category))
categoryRouter.delete('/delete/:id', deleteModelHandler(Category))

export default categoryRouter
