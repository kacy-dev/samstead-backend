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
      url: "https://samstead.onrender.com/api/auth",
    },
    {
      url: "https://samstead.onrender.com/api/categories",
    },
    {
      url: "https://samstead.onrender.com/api/paystack",
    },
    {
      url: "https://samstead.onrender.com/api/product",
    },
    {
      url: "https://samstead.onrender.com/api/user",
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
