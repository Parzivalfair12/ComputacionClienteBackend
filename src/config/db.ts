import mongoose from "mongoose";
import Color from "colors";
import { exit } from "node:process";
import "dotenv/config";

export const ConnectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está definida en .env");
    }

    const connection = await mongoose.connect(process.env.DATABASE_URL);

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(Color.magenta(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.log(Color.red("Error al conectar a MongoDB:"));
    console.log(error);
    exit(1);
  }
};
