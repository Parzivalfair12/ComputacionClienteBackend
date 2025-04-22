import { body } from "express-validator";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/Validation";
import { ProductController } from "../controllers/ProductController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos de panadería
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  authMiddleware,
  [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("El precio debe ser mayor a 0"),
    body("sku").notEmpty().withMessage("SKU no puede estar vacio"),
    body("category").isIn(["postre", "pan", "galletas", "tortas"]),
    body("stock").optional().isInt({ min: 0 }),
  ],
  handleInputErrors,
  ProductController.CreateProduct
);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos de panadería
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [pan, pasteleria, bebida, otros]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, inactivo]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authMiddleware, ProductController.GetAllProducts);

/**
 * @swagger
 * /api/products/{sku}:
 *   get:
 *     summary: Obtener un producto por SKU
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: SKU del producto (ej. PAN-INT-001)
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: SKU no proporcionado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:sku", authMiddleware, ProductController.GetProductBySku);

/**
 * @swagger
 * /api/products/{sku}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *           example: "PAN-INT-001"
 *     requestBody:
 *       required: true
 *       description: |
 *         Campos editables del producto.
 *         **Nota:** Todos los campos son opcionales excepto que se indique lo contrario.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Pan Integral Premium"
 *                 description: Nuevo nombre del producto
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Ahora con semillas orgánicas"
 *                 description: Descripción detallada
 *               precio:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 maximum: 1000
 *                 example: 4.75
 *                 description: Precio unitario (en dólares)
 *               categoria:
 *                 type: string
 *                 enum: [pan, pasteleria, bebida, otros]
 *                 example: "pan"
 *                 description: Categoría principal
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *                 description: Unidades disponibles
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 example: "activo"
 *                 description: Estado del producto en el sistema
 *               imagen:
 *                 type: string
 *                 example: "pan-premium.jpg"
 *                 description: Nombre/URL de la imagen
 *             additionalProperties: false
 *           examples:
 *             actualizacionParcial:
 *               summary: Actualización mínima
 *               value:
 *                 precio: 5.99
 *                 stock: 75
 *                 name: Pan Integral Premium
 *                 description: Pan con semillas orgánicas
 *                 category: pan
 *                 sku: PAN-INT-001
 *             actualizacionCompleta:
 *               summary: Actualización completa
 *               value:
 *                 nombre: "Pan Integral Premium Plus"
 *                 descripcion: "Nueva fórmula con semillas orgánicas"
 *                 precio: 5.99
 *                 categoria: "pan"
 *                 stock: 75
 *                 estado: "activo"
 *                 imagen: "pan-premium-v2.jpg"
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put("/:sku", authMiddleware, ProductController.UpdateProduct);

/**
 * @swagger
 * /api/products/{sku}:
 *   delete:
 *     summary: Eliminar un producto permanentemente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *           example: "PAN-INT-001"
 *         description: SKU del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Producto con SKU PAN-INT-001 eliminado correctamente"
 *       401:
 *         description: No autorizado (token inválido o faltante)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:sku", authMiddleware, ProductController.DeleteProduct);

export default router;
