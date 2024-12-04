const express = require("express");
const messageRoutes = require("./src/routes/messageRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes.js");
const sequelize = require("./src/config/database/database.js");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const { syncDatabase } = require("./src/models/index");
const messageQueue = require("./src/config/messageQueue.js");
require("./src/jobs/messageWorker");
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter')
require('dotenv').config()
const { router} = createBullBoard([
  new BullAdapter(messageQueue),
])
const setupSwagger = require('./swagger');


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: "Muitas requisições deste IP. Tente novamente mais tarde.",
});

(async () => {
  try {
    await sequelize.sync({ force: false }); // Cria a tabela se não existir
    console.log("Banco de dados sincronizado!");
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();

const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use("/messages/", messageRoutes);
app.use("/auth/", authRoutes);
app.use("/files/", fileRoutes);
app.use("/contact/", contactRoutes);
app.use(cors());
app.use('/admin/queues', router)
setupSwagger(app);
// Iniciar a sincronização
syncDatabase();

const PORT = process.env.SRV_PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
