//const express = require('express'); COMMON JS
import express from "express"; //MODULE JS
import "dotenv/config";
import router from "./router"
import { connectDB } from "./conf/db";

const app = express();

connectDB();

//Leer datos 
app.use(express.json());

app.use('/', router)

export default app;