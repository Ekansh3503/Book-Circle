'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'book',
          key: 'id'
        },
        onUpdate: 'CASCADE',
      },
      lenderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      borrowerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      clubId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'club',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5', '6', '7'),
        allowNull: false,
      },
      RequestDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pickupDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cancelReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      returnDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
 
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction');
  }
};
