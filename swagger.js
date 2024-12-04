const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WhatsApp Messaging API",
      version: "1.0.0",
      description: "API para envio de mensagens pelo WhatsApp",
    },
  },
  apis: ["./routes/*.js"], // Caminho para os arquivos de rotas
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
