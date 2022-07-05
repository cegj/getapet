import express from "express";

import UserController from "../controllers/UserController.mjs";

export const userRouter = express.Router()

userRouter.post('/register', UserController.register);