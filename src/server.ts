import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./config/db";
import UserRoutes from "./routes/UserRoutes"

dotenv.config();

//Aqui nos conectamos al mongo
ConnectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', UserRoutes);

export default app;