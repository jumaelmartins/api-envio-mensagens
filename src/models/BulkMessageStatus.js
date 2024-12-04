const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database/database");

class BulkMessageStatus extends Model {}

BulkMessageStatus.init(
  {
    batch_id: {
      type: DataTypes.STRING(255),
      primaryKey: true, // Garante que esta coluna será indexada
    },
    total_messages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sent_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    failed_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "BulkMessageStatus",
    timestamps: true,
    tableName: "bulk_message_status",
  }
);

module.exports = BulkMessageStatus;
