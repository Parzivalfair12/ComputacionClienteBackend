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
      description: "API para gestión de productos, inventario y usuarios de panadería",
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
              description: "Nombre del producto"
            },
            description: {
              type: "string",
              example: "Pan integral con semillas de girasol",
              description: "Descripción detallada"
            },
            price: {
              type: "number",
              format: "float",
              example: 3.50,
              minimum: 0,
              description: "Precio en dólares"
            },
            category: {
              type: "string",
              enum: ["pan", "pasteleria", "bebida", "otros"],
              example: "pan",
              description: "Categoría del producto"
            },
            image: {
              type: "string",
              example: "pan-integral.jpg",
              description: "URL de la imagen"
            },
            stock: {
              type: "integer",
              example: 50,
              minimum: 0,
              description: "Cantidad disponible"
            },
            sku: {
              type: "string",
              example: "PAN-INT-001",
              description: "Código único de identificación"
            },
            status: {
              type: "string",
              enum: ["activo", "inactivo"],
              example: "activo",
              description: "Estado del producto"
            }
          }
        },
        ProductResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Producto creado correctamente" },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "507f1f77bcf86cd799439011" },
                name: { type: "string", example: "Pan integral" },
                sku: { type: "string", example: "PAN-INT-001" },
                price: { type: "number", example: 3.50 },
                stock: { type: "integer", example: 50 },
                status: { type: "string", example: "activo" }
              }
            }
          }
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
              example: ["El SKU ya existe", "El precio debe ser positivo"]
            }
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT en el formato: Bearer <token>"
        }
      }
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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customSiteTitle: "API Panadería - Documentación",
    customCss: '.swagger-ui .topbar { display: none }'
  }));
};