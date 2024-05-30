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
categoryRouter.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const searchParams = { keyword };
    const results = await Category.search(searchParams);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
categoryRouter.use(verifyingtoken)
categoryRouter.post('/create', uploaded, createModelHandler(Category))
categoryRouter.put('/edit/:id', uploaded, updateModelHandler(Category))
categoryRouter.delete('/delete/:id', deleteModelHandler(Category))

export default categoryRouter
