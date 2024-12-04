const express = require("express");
const { getQRCode, logout, connectClient } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/qr-code/:id:
 *   post:
 *     summary: Geração de QR Code
 *     description: Rota para geração de QR Code para efetuar login no whatsapp-web.
 *     tags:
 *       - qr-code
 *     responses:
 *       200:
 *         description: Mensagens enviadas com sucesso
 *         content:
 *       400:
 *         description: Erro de validação nos dados enviados
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/qr-code/:id", getQRCode); 
router.post("/logout/:id", logout);
router.post("/connect-client/:id", connectClient);

module.exports = router;
