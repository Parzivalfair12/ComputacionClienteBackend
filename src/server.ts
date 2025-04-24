import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./config/db";
import { swaggerSetup } from "./config/swagger";

// Importaciones routes
import UserRoutes from "./routes/UserRoutes";
import ProductRoutes from "./routes/ProductRoutes"
import InventoryRoutes from "./routes/InventoryRoutes"
import EventRoutes from "./routes/EventRoutes"

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
app.use("/api/inventory", InventoryRoutes);
app.use("/api/events", EventRoutes);

export default app;
