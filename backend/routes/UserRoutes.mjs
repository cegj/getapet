import express from "express";

import UserController from "../controllers/UserController.mjs";

export const userRouter = express.Router()

userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.get('/checkuser', UserController.checkUser);
userRouter.get('/:id', UserController.getUserById);