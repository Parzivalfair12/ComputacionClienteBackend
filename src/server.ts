import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./config/db";
import UserRoutes from "./routes/UserRoutes";
import ProductRoutes from "./routes/ProductRoutes"
import { swaggerSetup } from "./config/swagger";

dotenv.config();

//Aqui nos conectamos al mongo
ConnectDB();

const app = express();
app.use(express.json());

// Realizamos la configuracion del swagger
swaggerSetup(app);

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/products", ProductRoutes);


export default app;
