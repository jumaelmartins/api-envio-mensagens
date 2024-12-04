const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database/database");
const BulkMessageStatus = require("./BulkMessageStatus");

class BulkMessageDetails extends Model {}

BulkMessageDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    batch_id: {
      type: DataTypes.STRING,
      references: {
        model: BulkMessageStatus,
        key: "batch_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "sent", "failed"),
      defaultValue: "pending",
    },
    error_message: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "BulkMessageDetails",
    timestamps: true,
  }
);

module.exports = BulkMessageDetails;
