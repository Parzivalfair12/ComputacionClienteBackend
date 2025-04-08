import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./config/db";

dotenv.config();

//Aqui nos conectamos al mongo
ConnectDB();

const app = express();
app.use(express.json());

// Ejemplo de ruta básica
app.get('/', (req, res) => {
  res.send('API funcionando');
});

export default app;