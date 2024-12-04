const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database/database");

class Contact extends Model {}

Contact.init(
    {
      number: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active", // Status padrão
      },
    },
    {
      sequelize,
      modelName: "Contact",
      timestamps: true,
    }
  );
  
  module.exports = Contact;