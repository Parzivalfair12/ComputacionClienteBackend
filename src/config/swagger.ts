import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import packageJson from "../../package.json";

const { version } = packageJson;
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Calidad Software",
      version,
      description: "Validamos los endpoints que usamos para verificar la calidad de un software",
    },
    components: {
      schemas: {
        User: {
          type: "object",
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
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
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
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
