import { Request, Response } from "express";
import Inventory from "../models/Inventory";
import mongoose from "mongoose";

export class InventoryController {
  static createMovement = async (req: Request, res: Response) => {
    const { product, amount, location, movement, reason } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(product)) {
        res.status(400).json({ message: "ID de producto no válido" });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ message: "La cantidad debe ser mayor a cero" });
        return;
      }

      const newMovement = new Inventory({
        product,
        amount,
        location,
        movement,
        reason,
      });

      await newMovement.save();

      res.status(201).json({
        message: `Movimiento de ${movement} registrado correctamente`,
        data: {
          id: newMovement._id,
          productId: newMovement.product,
          userId: newMovement.user,
          amount: newMovement.amount,
          movement: newMovement.movement,
        },
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: "Error de validación", errors });
        return;
      }

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

  static updateMovement = async (req: Request, res: Response) => {
    const { id,product, amount, location, movement, reason } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "ID de movimiento no válido" });
        return;
      }

      const existingMovement = await Inventory.findById(id);
      if (!existingMovement) {
        res.status(404).json({ message: "Movimiento no encontrado" });
        return;
      }

      if (product && !mongoose.Types.ObjectId.isValid(product)) {
        res.status(400).json({ message: "ID de producto no válido" });
        return;
      }

      const updatedMovement = await Inventory.findByIdAndUpdate(
        id,
        {
          product,
          amount,
          location,
          movement,
          reason,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        message: "Movimiento actualizado correctamente",
        data: {
          updatedMovement,
        },
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: "Error de validación", errors });
        return;
      }

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

  static GetAllInventories = async (req: Request, res: Response) => {
    try {
      const inventories = await Inventory.find()
        .sort({ createdAt: -1 })
        .populate("product", "name sku") // <-- Cambiado de 'producto' a 'product'
        .populate("user", "name email");

      res.json({
        success: true,
        data: inventories,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error interno del servidor";
      res.status(500).json({
        success: false,
        message: "Error al obtener los inventarios: " + errorMessage,
      });
    }
  };

  static GetProductById = async (req: Request, res: Response) => {
    try {
      const { Id } = req.params;
      if (!Id) {
        res.status(400).json({
          success: false,
          message: "El id es obligatorio",
        });
        return;
      }

      const inventory = await Inventory.findById(Id);

      if (!inventory) {
        res.status(404).json({
          success: false,
          message: "Inventario no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          inventory,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error al buscar el inventario",
        });
      }
    }
  };

  static DeleteInventory = async (req: Request, res: Response) => {
    try {
      const { Id } = req.params;

      const inventory = await Inventory.findByIdAndDelete(Id);

      if (!inventory) {
        res.status(404).json({
          success: false,
          message: "Inventario no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        message: `Inventario eliminado correctamente`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  };
}
