import { body } from "express-validator";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/Validation";
import { InventoryController } from "../controllers/InventoryController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Gestión de movimientos de inventario
 */

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Registra un movimiento de inventario
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - amount
 *               - location
 *               - movement
 *               - reason
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto
 *                 example: "507f1f77bcf86cd799439011"
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 description: Cantidad del movimiento
 *                 example: 10
 *               location:
 *                 type: string
 *                 description: Ubicación del inventario
 *                 example: "Almacén Central"
 *               movement:
 *                 type: string
 *                 enum: [entrada, salida]
 *                 description: Tipo de movimiento
 *                 example: "entrada"
 *               reason:
 *                 type: string
 *                 description: Razón del movimiento
 *                 example: "Compra a proveedor"
 *     responses:
 *       201:
 *         description: Movimiento registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     productId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     movement:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación en los datos
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  authMiddleware,
  [
    body("product")
      .notEmpty().withMessage("El producto es requerido")
      .isMongoId().withMessage("ID de producto no válido"),
    body("amount")
      .notEmpty().withMessage("La cantidad es requerida"),
    body("location")
      .notEmpty().withMessage("La ubicación es requerida"),
    body("movement")
      .notEmpty().withMessage("El tipo de movimiento es requerido")
      .isIn(["entrada", "salida"]).withMessage("Tipo de movimiento no válido"),
    body("reason")
      .notEmpty().withMessage("La razón del movimiento es requerida")
  ],
  handleInputErrors,
  InventoryController.createMovement
);

/**
 * @swagger
 * /api/inventory:
 *   put:
 *     summary: Actualiza un movimiento de inventario existente
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - product
 *               - amount
 *               - location
 *               - movement
 *               - reason
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del movimiento de inventario (MongoID válido)
 *                 example: "507f1f77bcf86cd799439011"
 *               product:
 *                 type: string
 *                 description: ID del inventario (MongoID válido)
 *                 example: "507f1f77bcf86cd799439011"
 *               amount:
 *                 type: number
 *                 description: Cantidad del movimiento (mayor a 0)
 *                 example: 10
 *               location:
 *                 type: string
 *                 description: Ubicación del movimiento
 *                 example: "Almacén Central"
 *               movement:
 *                 type: string
 *                 description: Tipo de movimiento (entrada/salida)
 *                 enum: [entrada, salida]
 *                 example: "entrada"
 *               reason:
 *                 type: string
 *                 description: Razón del movimiento
 *                 example: "Compra a proveedor"
 *     responses:
 *       200:
 *         description: Movimiento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Movimiento actualizado correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     productId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     userId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439013"
 *                     amount:
 *                       type: number
 *                       example: 10
 *                     movement:
 *                       type: string
 *                       example: "entrada"
 *       400:
 *         description: Error de validación en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error de validación"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ID de producto no válido", "La cantidad debe ser mayor a cero"]
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put(
  "/",
  authMiddleware,
  [
    body("product")
      .notEmpty().withMessage("El producto es requerido")
      .isMongoId().withMessage("ID de producto no válido"),
    body("amount")
      .notEmpty().withMessage("La cantidad es requerida"),
    body("location")
      .notEmpty().withMessage("La ubicación es requerida"),
    body("movement")
      .notEmpty().withMessage("El tipo de movimiento es requerido")
      .isIn(["entrada", "salida"]).withMessage("Tipo de movimiento no válido"),
    body("reason")
      .notEmpty().withMessage("La razón del movimiento es requerida")
  ],
  handleInputErrors,
  InventoryController.updateMovement
);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obtiene todos los movimientos de inventario
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Límite de resultados por página
 *       - in: query
 *         name: movement
 *         schema:
 *           type: string
 *           enum: [entrada, salida]
 *         description: Filtrar por tipo de movimiento
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Filtrar por ID de producto
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final para filtrar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de movimientos de inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       product:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       movement:
 *                         type: string
 *                       reason:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, InventoryController.GetAllInventories);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Obtiene un movimiento de inventario por ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         required: true
 *         description: ID del movimiento de inventario
 *     responses:
 *       200:
 *         description: Detalles del movimiento de inventario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     product:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     movement:
 *                       type: string
 *                       enum: [entrada, salida]
 *                     reason:
 *                       type: string
 *                     location:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID no válido
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 *   delete:
 *     summary: Elimina un movimiento de inventario
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         required: true
 *         description: ID del movimiento a eliminar
 *     responses:
 *       200:
 *         description: Movimiento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     deletedCount:
 *                       type: number
 *       400:
 *         description: ID no válido
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       403:
 *         description: No tiene permisos para esta acción
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */

router.get("/:Id", authMiddleware, InventoryController.GetProductById);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Elimina un movimiento de inventario permanentemente
 *     description: >
 *       Este endpoint elimina permanentemente un movimiento de inventario.
 *       Requiere autenticación y permisos de administrador.
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: mongo-id
 *           example: "507f1f77bcf86cd799439011"
 *         required: true
 *         description: ID válido de MongoDB del movimiento a eliminar
 *     responses:
 *       200:
 *         description: Movimiento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedId:
 *                       type: string
 *                       description: ID del movimiento eliminado
 *                     deletedCount:
 *                       type: integer
 *                       description: Número de documentos eliminados (1 si fue exitoso)
 *                       example: 1
 *       400:
 *         description: ID inválido o formato incorrecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "ID no válido"
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error al conectar con la base de datos"
 */
router.delete("/:Id", authMiddleware, InventoryController.DeleteInventory)

export default router;