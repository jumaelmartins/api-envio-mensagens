const { Client, LocalAuth } = require("whatsapp-web.js");
const { Message } = require("../models/");
const { Contact } = require("../models/")

const clients = {}; // Armazena as instâncias dos clientes

const initializeClient = (id) => {
  if (clients[id]) {
    console.log(`Cliente ${id} já existe.`);
    return clients[id];
  }
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: id }), // Diretório único para cada cliente
  });
  client.initialize();
  client.on("ready", () => {
    console.log(`Cliente ${id} conectado!`);
  });
  // Listener para mensagens recebidas
  client.on("message", async (message) => {
    try {
      const contactExists = await Contact.findOne({ where: { number: message.from } });
      console.log(`Contato encontrado? ${!!contactExists}`);

      if (contactExists && !message.fromMe ) {
        const savedMessage = await Message.create({
          contact_number: message.from,
          from: message.from,
          to: message.to,
          content: message.body,
          status: "received", // Define o status como "received" para mensagens recebidas
        });
        console.log(`Mensagem de ${message.from} salva com sucesso!`);
        await savedMessage.save();
      }
    } catch (error) {
      console.error("Erro ao salvar mensagem recebida:", error.message);
    }
  });

  client.on("disconnected", (reason) => {
    console.log(`Cliente ${id} desconectado: ${reason}`);
    delete clients[id];
  });

  client.on("qr", (qr) => {
    console.log(`QR Code para ${id}:`, qr);
    client.qrCode = qr; // Armazena o QR Code na instância
  });

  clients[id] = client;
  return client;
};

module.exports = { clients, initializeClient };
