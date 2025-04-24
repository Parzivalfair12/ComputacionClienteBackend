import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import EventController from "../controllers/EventController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gestión de eventos
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crea un nuevo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - fechaInicio
 *               - fechaFin
 *               - ubicacion
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del evento (máx. 100 caracteres)
 *                 example: "Conferencia de Tecnología"
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada del evento
 *                 example: "Evento anual sobre las últimas tendencias tecnológicas"
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio (ISO 8601)
 *                 example: "2023-12-15T09:00:00Z"
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de fin (ISO 8601)
 *                 example: "2023-12-15T18:00:00Z"
 *               ubicacion:
 *                 type: string
 *                 description: Lugar donde se realizará el evento
 *                 example: "Centro de Convenciones CDA"
 *               estado:
 *                 type: string
 *                 description: Estado del evento
 *                 enum: [activo, cancelado, completado]
 *                 default: activo
 *                 example: "activo"
 *               imagen:
 *                 type: string
 *                 description: URL de la imagen del evento
 *                 default: "default-event.jpg"
 *                 example: "evento-tech-2023.jpg"
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento creado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "654a58b7c5d4f85a1c4e13a2"
 *                     titulo:
 *                       type: string
 *                       example: "Conferencia de Tecnología"
 *                     descripcion:
 *                       type: string
 *                       example: "Evento anual sobre las últimas tendencias tecnológicas"
 *                     fechaInicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T09:00:00Z"
 *                     fechaFin:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-15T18:00:00Z"
 *                     ubicacion:
 *                       type: string
 *                       example: "Centro de Convenciones CDA"
 *                     estado:
 *                       type: string
 *                       example: "activo"
 *                     imagen:
 *                       type: string
 *                       example: "evento-tech-2023.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-08T14:30:00Z"
 *       400:
 *         description: Error de validación
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
 *                   example: ["La fecha de fin no puede ser anterior a la fecha de inicio", "El título es requerido"]
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
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
router.post("/", authMiddleware, EventController.createEvent)

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtiene todos los eventos
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, cancelado, completado]
 *         description: Filtrar eventos por estado
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       500:
 *         description: Error interno del servidor
 */

router.get("/", authMiddleware, EventController.GetAllEvents)

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Obtiene un evento específico por ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a obtener
 *     responses:
 *       200:
 *         description: Evento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: ID no válido
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:Id", authMiddleware, EventController.GetAllEvents)

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Elimina un evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongo-id
 *         description: ID del evento a eliminar
 *         example: "654a58b7c5d4f85a1c4e13a2"
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventDeleteResponse'
 *       400:
 *         description: ID inválido o error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:Id", authMiddleware, EventController.DeleteEvent)

/**
 * @swagger
 * /api/events:
 *   put:
 *     summary: Actualiza un evento existente
 *     description: Permite actualizar parcial o totalmente la información de un evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Id
 *             properties:
 *               Id:
 *                 type: string
 *                 format: mongo-id
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: ID del evento a actualizar
 *               titulo:
 *                 type: string
 *                 example: "Conferencia de Tecnología Actualizada"
 *                 description: Nuevo título del evento
 *               descripcion:
 *                 type: string
 *                 example: "Descripción actualizada del evento"
 *                 description: Nueva descripción detallada
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-16T09:00:00Z"
 *                 description: Nueva fecha y hora de inicio
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-16T18:00:00Z"
 *                 description: Nueva fecha y hora de fin
 *               ubicacion:
 *                 type: string
 *                 example: "Nuevo Centro de Convenciones"
 *                 description: Nueva ubicación del evento
 *               estado:
 *                 type: string
 *                 enum: [activo, cancelado, completado]
 *                 example: "activo"
 *                 description: Nuevo estado del evento
 *               imagen:
 *                 type: string
 *                 example: "nueva-imagen-evento.jpg"
 *                 description: Nueva imagen del evento
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento actualizado correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedEvent:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Error en los datos de entrada
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
 *                   example: ["La fecha de fin no puede ser anterior a la fecha de inicio"]
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Evento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor al actualizar el evento"
 */
router.put("/", authMiddleware, EventController.updateEvent)

export default router