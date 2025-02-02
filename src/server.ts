import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import express from 'express';
import router from './router';
import { connectDB } from './conf/db';
import { corsConfig } from "./conf/cors";

connectDB();

const app = express();

//Cors
app.use(cors(corsConfig))
//Read data 
app.use(express.json());

app.use('/', router);

export default app;