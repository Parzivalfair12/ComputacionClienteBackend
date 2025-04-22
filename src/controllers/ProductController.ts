import { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
  static CreateProduct = async (req: Request, res: Response) => {
    const { name, description, price, category, image, stock, sku } = req.body;

    try {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        res.status(400).json({
          message: "El SKU ya está registrado para otro producto",
        });
        return;
      }

      const product = new Product({
        name,
        description,
        price,
        category,
        image: image || "",
        stock: stock || 0,
        sku: sku.toUpperCase(),
      });

      await product.save();

      res.status(201).json({
        message: "Producto creado correctamente",
        data: {
          id: product._id,
          nombre: product.name,
          sku: product.sku,
          precio: product.price,
          stock: product.stock,
          estado: product.status,
        },
      });
    } catch (error) {
      let errorMessage = "Error interno del servidor";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json({
        message: errorMessage,
      });
    }
  };

  static GetProductBySku = async (req: Request, res: Response) => {
    try {
      const { sku } = req.params;
      if (!sku) {
        res.status(400).json({
          success: false,
          message: "El SKU es obligatorio",
        });
        return;
      }

      const product = await Product.findOne({
        sku: sku.toUpperCase(),
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          sku: product.sku,
          PermissionStatus: product.status,
          image: product.image,
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
          message: "Error al buscar el producto",
        });
      }
    }
  };

  static GetAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data: products,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error interno del servidor";
      res.status(500).json({
        success: false,
        message: "Error al obtener productos: " + errorMessage,
      });
    }
  };

  static UpdateProduct = async (req: Request, res: Response) => {
    const { sku } = req.params;
    const updateData = req.body;

    try {
      if (!sku || typeof sku !== "string") {
        res.status(400).json({
          success: false,
          message: "El SKU es requerido y debe ser una cadena de texto",
        });
        return;
      }

      if (updateData.precio <= 0) {
        res.status(400).json({
          success: false,
          message: "El precio debe ser un número positivo",
          invalidField: "precio",
        });
        return;
      }

      if (updateData.stock < 0) {
        res.status(400).json({
          success: false,
          message: "El stock debe ser un entero positivo",
          invalidField: "stock",
        });
        return;
      }

      const categoriasValidas = ["pan", "pasteleria", "bebida", "otros"];
      if (
        updateData.categoria &&
        !categoriasValidas.includes(updateData.categoria)
      ) {
        res.status(400).json({
          success: false,
          message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(
            ", "
          )}`,
          invalidField: "categoria",
        });
        return;
      }

      const estadosValidos = ["activo", "inactivo"];
      if (updateData.estado && !estadosValidos.includes(updateData.estado)) {
        res.status(400).json({
          success: false,
          message: `Estado inválido. Valores permitidos: ${estadosValidos.join(
            ", "
          )}`,
          invalidField: "estado",
        });
        return;
      }

      const product = await Product.findOneAndUpdate(
        { sku: sku.toUpperCase() },
        { $set: updateData },
        {
          new: true,
          runValidators: true,
          projection: { __v: 0 },
        }
      );

      if (!product) {
        res.status(404).json({
          success: false,
          message: `Producto con SKU ${sku} no encontrado`,
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          caregory: product.category,
          stock: product.stock,
          sku: product.sku,
          status: product.status,
          image: product.image,
        },
      });
      return;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error interno en el servidor";
      res.status(500).json({
        success: false,
        message: `Error al actualizar producto: ${errorMessage}`,
      });
      return;
    }
  };

  static DeleteProduct = async (req: Request, res: Response) => {
    try {
      const { sku } = req.params;

      const product = await Product.findOneAndDelete({
        sku: sku.toUpperCase(),
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        message: `Producto con SKU ${sku} eliminado correctamente`,
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
