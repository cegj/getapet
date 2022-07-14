import express from 'express';
import cors from 'cors';
import {userRouter} from './routes/userRoutes.mjs';
import { petRouter } from './routes/PetRoutes.mjs';

const app = express();

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// Public folder for images
app.use(express.static('public'))

// Routes
app.use('/users', userRouter)
app.use('/pets', petRouter)

// Start
app.listen(5000)