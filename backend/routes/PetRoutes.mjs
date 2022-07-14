import express, { Router } from "express";
import { PetController } from "../controllers/PetController.mjs";

//middlewares
import { verifyToken } from "../helpers/verify-token.mjs";
import { imageUpload } from "../helpers/image-uploader.mjs";

export const petRouter = express.Router();

petRouter.post('/create', verifyToken, imageUpload.array('images'), PetController.create);
petRouter.get('/', PetController.getAll);
petRouter.get('/mypets', verifyToken, PetController.getAllUserPets);