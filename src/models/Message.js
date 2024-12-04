const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database/database");
const Contact = require("./Contact");

class Message extends Model {}

Message.init(
  {
    chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contact_number: { // Consistência no nome da chave estrangeira
      type: DataTypes.STRING,
      references: {
        model: Contact,
        key: "number",
      },
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Message",
    timestamps: true,
  }
);

module.exports = Message;
