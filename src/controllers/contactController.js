const Contact = require("../models/Contact");

exports.getActiveContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { status: "active" } });
    return res.status(200).json(contacts);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao buscar contatos: ${error.message}` });
  }
};

exports.getMessagesByContact = async () => {
  const { number } = req.params;

  try {
    const contact = await Contact.findOne({
      where: { number },
      include: ["Messages"],
    });
    console.log(contact.Messages);
  } catch (err) {
    console.error(err);
  }
};

exports.deleteContact = async (req, res) => {
  const { number } = req.params;
  try {
    const contact = await Contact.findOne({ where: { number } });
    if (!contact) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }
    contact.status = "inactive";
    await contact.save();
    return res.status(200).json({ success: "Contato desativado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao desativar contato: ${error.message}` });
  }
};
exports.updateContact = async (req, res) => {
  const { number } = req.params;
  try {
    const contact = await Contact.findOne({ where: { number } });
    if (!contact) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }
    await contact.update({
      ...req.body,
    });
    await contact.save();
    return res.status(200).json({ success: "Contato desativado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao desativar contato: ${error.message}` });
  }
};
