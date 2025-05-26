// import { SwaggerOptions } from 'swagger-jsdoc';

// const swagger_options: SwaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Kacy’s API',
//       version: '1.0.0',
//       description: 'A Node.js API documented with Swagger and TypeScript',
//     },
//     servers: [
//       {
//         url: 'https://your-api.onrender.com',
//       },
//     ],
//   },
//   apis: ['./src/routes/*.ts'],
// };

// export default swagger_options;



import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Samsted API Docs",
    version: "1.0.0",
    description: "API documentation for Samstead",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  servers: [
    {
      url: "http://localhost:5060/api-docs"
    }
    // {
    //   url: "https://samstead.onrender.com/api/categories",
    // },
    // {
    //   url: "https://samstead.onrender.com/api/paystack",
    // },
    // {
    //   url: "https://samstead.onrender.com/api/product",
    // },
    // {
    //   url: "https://samstead.onrender.com/api/user",
    // },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["../routes/*.ts", "../controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
