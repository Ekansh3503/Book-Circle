'use strict';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const location = sequelize.define('location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING
  },
  clubId:{
    type: DataTypes.INTEGER,
    references: {
      model: 'club',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  modelName: 'location',
  timestamps: true,
});



export default location;