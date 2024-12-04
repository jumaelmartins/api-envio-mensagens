const client = require("../services/whatsappClients");
const path = require("path");

exports.sendFile = async (req, res) => {
    const { number } = req.body;
    const filePath = req.file?.path; // Supondo que você use um middleware como multer
    if (!number || !filePath) {
        return res.status(400).json({ error: "Número e arquivo são obrigatórios!" });
    }
    const chatId = `${number}@c.us`;
    try {
        const media = MessageMedia.fromFilePath(filePath);
        await client.sendMessage(chatId, media);
        return res.status(200).json({ success: `Arquivo enviado para ${number}` });
    } catch (error) {
        return res.status(500).json({ error: `Erro ao enviar arquivo: ${error.message}` });
    }
};
