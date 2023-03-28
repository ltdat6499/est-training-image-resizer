"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {}
  }
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      dataInfo: {
        field: "data_info",
        type: DataTypes.JSONB,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "images",
      modelName: "Image",
      timestamps: false,
    }
  );
  return Image;
};
