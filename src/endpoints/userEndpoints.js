import express from 'express';
import User from '../models/User.js';
import { createModelHandler, readModelHandler, updateModelHandler, deleteModelHandler } from '../controllers/crud.js';

const userRouter = express.Router();

userRouter.post('/', createModelHandler(User));
userRouter.get('/', readModelHandler(User));
userRouter.put('/:id', updateModelHandler(User));
userRouter.delete('/:id', deleteModelHandler(User));

export default userRouter;