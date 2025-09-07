'use strict';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const transaction = sequelize.define('transaction',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'book',
            key: 'id'
        },
        onUpdate: 'CASCADE',
    },
    lenderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    borrowerId: {
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
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7'),
        allowNull: false,
    },
    RequestDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    pickupDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    cancelReason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
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
    modelName: 'transaction',
    timestamps: true,
});

export default transaction;