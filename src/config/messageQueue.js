const Bull = require('bull');
require("dotenv").config()

// Cria a fila com o nome "bulk-message" conectando ao Redis
const messageQueue = new Bull('bulk-message', {
  redis: {
    host: process.env.REDIS_HOST, // Endereço do Redis
    port: process.env.REDIS_PORT,        // Porta do Redis
  },
});

module.exports = messageQueue;
