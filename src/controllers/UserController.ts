import { Request, Response } from "express";
import User from "../models/User";

export class UserController {
  static CreateUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(409).json({ message: "El usuario ya está registrado" });
        return;
      }

      const user = new User({ name, email, password });
      await user.save();

      res.status(201).json({
        message: "Usuario creado correctamente",
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static FindUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.status(400).json({
          message: "Email y contraseña son obligatorios",
        });
        return;
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        res.status(404).json({
          message: "Usuario no encontrado",
        });
        return;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          message: "Credenciales inválidas",
        });
        return;
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        confirmado: user.confirmado,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };
}
