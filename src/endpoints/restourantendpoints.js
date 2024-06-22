import Restourant from '../models/restoutantprofile.js'
import dotenv from 'dotenv'
import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { uploaded } from '../utils/multer.js'

import {
  createModelHandler,
  deleteModelHandler,
  readModelHandler,
  updateModelHandler
} from '../controllers/crud.js'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
Restourant
const RestourantRouter = express.Router()

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// Create or update the Restourant profile
RestourantRouter.post('/create', uploaded, createModelHandler(Restourant))

// Get the Restourant profile
RestourantRouter.get('/get', readModelHandler(Restourant))

// Update the Restourant profile
RestourantRouter.put('/update', uploaded, updateModelHandler(Restourant))
RestourantRouter.get('/getby-id/:id', readModelHandler(Restourant))
RestourantRouter.delete('/delete', deleteModelHandler(Restourant))

export default RestourantRouter
