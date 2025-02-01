import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import router from './router';
import { connectDB } from './conf/db';

const app = express();

connectDB();

//Read data 
 app.use(express.json());

app.use('/', router);

export default app;