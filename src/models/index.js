const sequelize = require("../config/database/database");
const Contact = require("./Contact");
const Message = require("./Message");
const BulkMessageDetails = require("./BulkMessageDetails");
const BulkMessageStatus = require("./BulkMessageStatus");

// Configura os relacionamentos
Contact.hasMany(Message, {
  foreignKey: "contact_number",
});

Message.belongsTo(Contact, {
  foreignKey: "contact_number",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BulkMessageStatus.hasMany(BulkMessageDetails, {
  foreignKey: "batch_id",
});
BulkMessageDetails.belongsTo(BulkMessageStatus, {
  foreignKey: "batch_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Função para sincronizar as tabelas
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    await sequelize.sync({ force: true }); // Sincroniza os modelos com o BD
    console.log("Tabelas sincronizadas!");
  } catch (error) {
    console.error("Erro ao conectar ou sincronizar o banco de dados:", error);
  }
};

module.exports = {
  Contact,
  Message,
  syncDatabase,
  BulkMessageStatus,
  BulkMessageDetails,
};
