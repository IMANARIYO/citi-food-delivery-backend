import "../models/User.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { User } from "../models/User.js";

User
const userRouter = express.Router();

userRouter.post('/', createModelHandler(User));
userRouter.get('/', readModelHandler(User));
userRouter.put('/:id', updateModelHandler(User));
userRouter.delete('/:id', deleteModelHandler(User));

export default userRouter;