import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: any;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Acceso no autorizado" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "secret_key";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
};
