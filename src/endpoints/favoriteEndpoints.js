import Favorite from "../models/Favorite.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const favoriteRouter = express.Router();
favoriteRouter.use(verifyingtoken);
favoriteRouter.post('/create', createModelHandler(Favorite));
favoriteRouter.get('/get/', readModelHandler(Favorite));
favoriteRouter.get('/get/:id', readModelHandler(Favorite));
favoriteRouter.put('/edit/:id', updateModelHandler(Favorite));
favoriteRouter.delete('/delete/:id', deleteModelHandler(Favorite));

export default favoriteRouter;