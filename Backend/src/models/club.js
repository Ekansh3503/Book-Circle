'use strict';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const club = sequelize.define('club',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  club_name: {
    type: DataTypes.STRING
  },
  club_contact_email: {
    type: DataTypes.STRING
  },
  club_thumbnail_url: {
    type: DataTypes.STRING
  },
  club_location: {
    type: DataTypes.STRING
  },
  club_status: {
    type: DataTypes.BOOLEAN
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'club',
  
});

export default club;
