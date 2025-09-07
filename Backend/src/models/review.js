'use strict';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const review = sequelize.define('review', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    rating: {
        type: DataTypes.INTEGER
    },
    reviewText: {
        type: DataTypes.STRING
    },
    isApproved: {
        type: DataTypes.BOOLEAN
    },
    userId: {
        type: DataTypes.INTEGER,
        REFERENCES: {
            model: clubuser,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    modelName: 'review',

});


export default review;
