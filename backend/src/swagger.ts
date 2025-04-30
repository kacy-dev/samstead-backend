import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Samsted API Docs",
    version: "1.0.0",
    description: "API documentation for Samstead",
  },
  servers: [
    {
      url: "http://localhost:5000/api/auth",
    },
    {
      url: "http://localhost:5000/api/categories",
    },
    {
      url: "http://localhost:5000/api/paystack",
    },
    {
      url: "http://localhost:5000/api/product",
    },
    {
      url: "http://localhost:5000/api/user",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
