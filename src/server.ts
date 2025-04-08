import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// Ejemplo de ruta básica
app.get('/', (req, res) => {
  res.send('API funcionando');
});

export default app;