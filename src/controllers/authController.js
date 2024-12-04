const { initializeClient, clients } = require("../services/whatsappClients");
const qrcode = require("qrcode-terminal"); // Pacote para exibir QR Code no terminal

exports.getQRCode = async (req, res) => {
  const { id } = req.params;
  // Inicializa ou retorna o cliente existente
  const client = initializeClient(id);
  // Certifique-se de que o cliente não está autenticado
  if(!id) {
    return res.status(400).json({message: "Envie um id"})
  }

  if (client.info) {
    return res.status(200).json({ message: "Já autenticado no WhatsApp" });
  }
  // Verifica se o QR Code já está disponível
  if (client.qrCode) {
    qrcode.generate(qr, { small: true });
    return res.status(200).json({ qr: client.qrCode });
  }
  // Aguarda o evento do QR Code se ainda não foi gerado
  client.once("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    return res.status(200).json({ qr });
  });
};

exports.connectClient = (req, res) => {
  const { id } = req.params; // Ex.: número de telefone

  if(!id) {
    return res.status(400).json({message: "Envie um id"})
  }

  if (!clients[id]) {
    initializeClient(id);
    return res.status(200).json({ message: `Cliente ${id} inicializado!` });
  } else {
    return res.status(400).json({ error: "Cliente já conectado." });
  }
};

exports.logout = async (req, res) => {
  const { id } = req.params;

  const client = clients[id];
  if (!client) {
    return res.status(400).json({ error: "Cliente não encontrado." });
  }

  try {
    await client.logout(); // Finaliza a sessão
    delete clients[id]; // Remove o cliente da memória
    return res.status(200).json({ success: "Desconectado do WhatsApp" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Erro ao desconectar: ${err.message}` });
  }
};
