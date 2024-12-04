const { Sequelize } = require("sequelize");
require("dotenv").config();
// const path = require("path");

const sequelize = new Sequelize({
  dialect: "mariadb",
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_SCHEMA,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

module.exports = sequelize;
