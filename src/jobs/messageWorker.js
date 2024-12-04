const messageQueue = require("../config/messageQueue");
const Contact = require("../models/Contact"); // Ajuste o caminho para o seu modelo
const Message = require("../models/Message"); // Ajuste o caminho para o seu modelo
const clients = require("../services/whatsappClients"); // Onde você armazena os clientes ativos
const BulkMessageStatus = require("../models/BulkMessageStatus");
const BulkMessageDetails = require("../models/BulkMessageDetails");

const processBulkMessages = async (job) => {
  const { id, data, batch_id } = job.data;
  const client = clients["clients"][id]; // Recupera o cliente usando o ID
  if (!client) {
    console.error(`Cliente com ID ${id} não encontrado.`);
    throw new Error(`Cliente com ID ${id} não encontrado.`);
  }

  const from = `55${id}@c.us`;
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
  await BulkMessageStatus.create({
    batch_id,
    total_messages: data.length,
    status: "pending",
  });

  for (const row of data) {
    const { contato, mensagem, nome, regional, service_id, ordem } = row;

    const { id: messageId } = await BulkMessageDetails.create({
      batch_id,
      contact_number: row.contato,
      message_content: row.mensagem,
      status: "pending",
    });

    if (!contato || !mensagem) {
      console.error(`Linha inválida: ${JSON.stringify(row)}`);
      continue;
    }

    const chatId = `55${contato}@c.us`;

    try {
      // Verifica e cria o contato, se necessário
      let contact = await Contact.findOne({ where: { number: chatId } });

      if (!contact) {
        contact = await Contact.create({
          number: chatId,
          name: nome || "Desconhecido",
          region: regional || "Não informada",
          service_id: service_id || null,
          status: "active",
        });
      }

      // Cria a mensagem
      await Message.create({
        chat_id: null,
        contact_number: contact.number,
        from,
        to: chatId,
        content: mensagem,
        ordem: ordem || null,
        status: "queued", // Status inicial
      });

      await client.sendMessage(chatId, mensagem);

      await BulkMessageDetails.update(
        { status: "sent" },
        { where: { id: messageId } }
      );
      await BulkMessageStatus.increment("sent_count", {
        where: { batch_id },
      });
      console.log(`Mensagem enviada para ${contato}: ${mensagem}`);
    } catch (error) {
      await BulkMessageDetails.update(
        { status: "failed", error_message: error.message },
        { where: { id: messageId } }
      );
      await BulkMessageStatus.increment("failed_count", {
        where: { batch_id },
      });

      console.error(
        `Erro ao enviar mensagem para ${contato}: ${error.message}`
      );
    }
  }

  const batch = await BulkMessageStatus.findByPk(batch_id);
  const finalStatus =
    batch.sent_count === batch.total_messages ? "completed" : "failed";
  await BulkMessageStatus.update(
    { status: finalStatus },
    { where: { batch_id } }
  );

  console.log(`Processamento do batch ${id} concluído.`);
};

messageQueue.process(async (job) => {
  await processBulkMessages(job);
});
