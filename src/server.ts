//const express = require('express'); COMMON JS
import express from "express"; //MODULE JS
import router from "./router"

const app = express();

app.use('/', router)

export default app;