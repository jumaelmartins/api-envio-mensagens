const Joi = require("joi");
const Message = require("../models/Message");
const Contact = require("../models/Contact");
const { clients } = require("../services/whatsappClients");
const XLSX = require("xlsx");
const messageQueue = require("../config/messageQueue");
const BulkMessageStatus = require("../models/BulkMessageStatus");
const BulkMessageDetails = require("../models/BulkMessageDetails");

// Schema de validação com Joi
const messageSchema = Joi.object({
  number: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.empty": "O número é obrigatório.",
      "string.pattern.base":
        "O número deve conter apenas dígitos e ter entre 10 e 15 caracteres.",
    }),
  message: Joi.string().min(1).max(500).required().messages({
    "string.empty": "A mensagem não pode estar vazia.",
    "string.min": "A mensagem deve ter pelo menos 1 caractere.",
    "string.max": "A mensagem não pode exceder 500 caracteres.",
  }),
});

exports.sendMessage = async (req, res) => {
  const { number, message, name, region, service_id, order } = req.body;
  const { id } = req.params;
  const client = clients[id];
  // Verifique se o cliente está inicializado
  if (!client) {
    return res
      .status(400)
      .json({ error: `Cliente com ID ${id} não encontrado.` });
  }

  // Validação dos dados recebidos
  const { error } = messageSchema.validate({ number, message });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const chatId = `55${number}@c.us`;
  const from = `55${id}@c.us`;

  try {
    console.log(`Enviando mensagem para: ${chatId}`);
    await client.sendMessage(chatId, message);

    const contactExists = await Contact.findOne({ where: { number: chatId } });

    if (!contactExists) {
      const newContact = await Contact.create({
        number: chatId,
        name: name,
        region: region,
        service_id: service_id,
        status: "active",
      });
      newContact.save();
    }
    const savedMessage = await Message.create({
      contact_number: chatId,
      from: from,
      to: chatId,
      content: message,
      status: "sent",
      order: order,
    });
    savedMessage.status = "sent";
    await savedMessage.save();
    console.log("Mensagem salva:");
    return res.status(200).json({ success: `Mensagem enviada para ${number}` });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: `Erro ao enviar mensagem: ${err.message}` });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao buscar mensagens: ${error.message}` });
  }
};

exports.sendBulkMessages = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Envie um ID" });
  }

  const client = clients[id];
  if (!client) {
    return res.status(404).json({ message: "Cliente não encontrado." });
  }

  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  try {
    const client = clients[id];
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }

    const batch_id = generateUniqueId();
    // Adiciona o trabalho à fila, passando apenas o ID e os dados
    const job = await messageQueue.add({ id, data, batch_id }, { attempts: 3 });

    res.status(200).json({
      success: true,
      message: "Solicitação adicionada à fila.",
      jobId: job.id,
      batch_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar à fila." });
  }
};

exports.getBatchStatus = async (req, res) => {
  const { batchId } = req.params;
  const batch = await BulkMessageStatus.findOne({
    where: { batch_id: batchId },
  });
  const messages = await BulkMessageDetails.findAll({
    where: { batch_id: batchId },
  });

  res.json({ batch, messages });
};

exports.getFailedMessages = async (req, res) => {
  const { batchId } = req.params;
  const failedMessages = await BulkMessageDetails.findAll({
    where: { batch_id: batchId, status: "failed" },
  });
  res.json(failedMessages);
};
