import express, { Router } from "express";
import { PetController } from "../controllers/PetController.mjs";

//middlewares
import { verifyToken } from "../helpers/verify-token.mjs";
import { imageUpload } from "../helpers/image-uploader.mjs";

export const petRouter = express.Router();

petRouter.post('/create', verifyToken, imageUpload.array('images'), PetController.create);
petRouter.get('/', PetController.getAll);
petRouter.get('/mypets', verifyToken, PetController.getAllUserPets);
petRouter.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);
petRouter.get('/:id', PetController.getPetById);
petRouter.delete('/:id', verifyToken, PetController.removePetById);
petRouter.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)