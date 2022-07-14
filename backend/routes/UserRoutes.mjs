import express from "express";

import UserController from "../controllers/UserController.mjs";

import { verifyToken } from "../helpers/verify-token.mjs";

import { imageUpload } from "../helpers/image-uploader.mjs";

export const userRouter = express.Router()

userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.get('/checkuser', UserController.checkUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.patch('/edit', verifyToken, imageUpload.single("image"), UserController.editUser);