'use strict';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const clubuser = sequelize.define('clubuser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  clubId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'club',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  role: {
    type: DataTypes.ENUM('0','1','2'),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
}, {
  freezeTableName: true,
  modelName: 'clubuser',
  timestamps: true,
});



export default clubuser;