import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import packageJson from "../../package.json";

const { version } = packageJson;
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Panadería",
      version,
      description:
        "API para gestión de productos, inventario y usuarios de panadería",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Andres Chaves",
            },
            email: {
              type: "string",
              format: "email",
              example: "andreschaveso0412@gmail.com",
            },
            password: {
              type: "string",
              example: "Andres2004.",
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
              example: "user",
            },
          },
        },
        Product: {
          type: "object",
          required: ["nombre", "precio", "sku", "categoria"],
          properties: {
            name: {
              type: "string",
              example: "Pan integral",
              description: "Nombre del producto",
            },
            description: {
              type: "string",
              example: "Pan integral con semillas de girasol",
              description: "Descripción detallada",
            },
            price: {
              type: "number",
              format: "float",
              example: 3.5,
              minimum: 0,
              description: "Precio en dólares",
            },
            category: {
              type: "string",
              enum: ["pan", "pasteleria", "bebida", "otros"],
              example: "pan",
              description: "Categoría del producto",
            },
            image: {
              type: "string",
              example: "pan-integral.jpg",
              description: "URL de la imagen",
            },
            stock: {
              type: "integer",
              example: 50,
              minimum: 0,
              description: "Cantidad disponible",
            },
            sku: {
              type: "string",
              example: "PAN-INT-001",
              description: "Código único de identificación",
            },
            status: {
              type: "string",
              enum: ["activo", "inactivo"],
              example: "activo",
              description: "Estado del producto",
            },
          },
        },
        ProductResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Producto creado correctamente",
            },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "507f1f77bcf86cd799439011" },
                name: { type: "string", example: "Pan integral" },
                sku: { type: "string", example: "PAN-INT-001" },
                price: { type: "number", example: 3.5 },
                stock: { type: "integer", example: 50 },
                status: { type: "string", example: "activo" },
              },
            },
          },
        },
        Inventory: {
          type: "object",
          required: [
            "product",
            "amount",
            "location",
            "movement",
            "reason",
            "user",
          ],
          properties: {
            product: {
              type: "string",
              format: "mongo-id",
              example: "507f1f77bcf86cd799439011",
              description: "Referencia al producto (ID)",
            },
            amount: {
              type: "number",
              example: 10,
              minimum: 0.01,
              description: "Cantidad del movimiento",
            },
            location: {
              type: "string",
              example: "Almacén Principal",
              enum: [
                "Almacén Principal",
                "Almacén Secundario",
                "Mostrador",
                "Tránsito",
              ],
              description: "Ubicación física del inventario",
            },
            movement: {
              type: "string",
              enum: ["entrada", "salida", "ajuste"],
              example: "entrada",
              description: "Tipo de movimiento",
            },
            reason: {
              type: "string",
              example: "Compra a proveedor",
              enum: [
                "Compra a proveedor",
                "Venta al público",
                "Ajuste de inventario",
                "Donación",
                "Pérdida",
              ],
              description: "Motivo del movimiento",
            },
            user: {
              type: "string",
              format: "mongo-id",
              example: "6118e9f65ef21b001f3e8e7c",
              description: "Usuario que registró el movimiento (ID)",
            },
            reference: {
              type: "string",
              example: "FAC-2023-001",
              nullable: true,
              description: "Número de factura/documento asociado",
            },
            notes: {
              type: "string",
              example: "Producto con lote #12345",
              maxLength: 500,
              nullable: true,
              description: "Observaciones adicionales",
            },
            expirationDate: {
              type: "string",
              format: "date",
              example: "2023-12-31",
              nullable: true,
              description: "Fecha de vencimiento (opcional)",
            },
            batch: {
              type: "string",
              example: "LOTE-2023-05",
              nullable: true,
              description: "Número de lote",
            },
          },
        },
        InventoryResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "6118e9f65ef21b001f3e8e7c" },
                product: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "507f1f77bcf86cd799439011" },
                    name: { type: "string", example: "Pan Integral" },
                    sku: { type: "string", example: "PAN-INT-500" },
                  },
                },
                amount: { type: "number", example: 10 },
                movement: { type: "string", example: "entrada" },
                location: { type: "string", example: "Almacén Principal" },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2023-05-15T10:00:00Z",
                },
              },
            },
          },
        },
        Event: {
          type: "object",
          required: [
            "titulo",
            "descripcion",
            "fechaInicio",
            "fechaFin",
            "ubicacion",
          ],
          properties: {
            id: {
              type: "string",
              example: "654a58b7c5d4f85a1c4e13a2",
              description: "ID único del evento",
            },
            titulo: {
              type: "string",
              example: "Conferencia de Tecnología",
              description: "Título del evento",
              maxLength: 100,
            },
            descripcion: {
              type: "string",
              example: "Evento anual sobre las últimas tendencias tecnológicas",
              description: "Descripción detallada del evento",
            },
            fechaInicio: {
              type: "string",
              format: "date-time",
              example: "2023-12-15T09:00:00Z",
              description: "Fecha y hora de inicio del evento",
            },
            fechaFin: {
              type: "string",
              format: "date-time",
              example: "2023-12-15T18:00:00Z",
              description: "Fecha y hora de finalización del evento",
            },
            ubicacion: {
              type: "string",
              example: "Centro de Convenciones CDA",
              description: "Lugar donde se realizará el evento",
            },
            estado: {
              type: "string",
              enum: ["activo", "cancelado", "completado"],
              default: "activo",
              example: "activo",
              description: "Estado actual del evento",
            },
            imagen: {
              type: "string",
              default: "default-event.jpg",
              example: "evento-tech-2023.jpg",
              description: "Imagen representativa del evento",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-11-08T14:30:00Z",
              description: "Fecha de creación del registro",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-11-08T14:35:00Z",
              description: "Fecha de última actualización",
            },
          },
        },
        EventResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Evento creado correctamente",
            },
            data: {
              $ref: "#/components/schemas/Event",
            },
          },
        },
        EventListResponse: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              example: 15,
              description: "Total de eventos disponibles",
            },
            page: {
              type: "integer",
              example: 1,
              description: "Página actual",
            },
            limit: {
              type: "integer",
              example: 10,
              description: "Límite de resultados por página",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Event",
              },
            },
          },
        },
        EventDeleteResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Evento eliminado correctamente",
            },
            deletedEvent: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "654a58b7c5d4f85a1c4e13a2",
                },
                titulo: {
                  type: "string",
                  example: "Conferencia de Tecnología",
                },
                fechaInicio: {
                  type: "string",
                  format: "date-time",
                  example: "2023-12-15T09:00:00Z",
                },
                fechaFin: {
                  type: "string",
                  format: "date-time",
                  example: "2023-12-15T18:00:00Z",
                },
                estado: {
                  type: "string",
                  example: "activo",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: { type: "string" },
              example: ["El SKU ya existe", "El precio debe ser positivo"],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT en el formato: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app: any) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customSiteTitle: "API Panadería - Documentación",
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
};
