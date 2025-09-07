'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      }, 
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phone_no: {
        type: Sequelize.STRING
      },
      setPasswordToken: {
        type: Sequelize.STRING
      },
      setPasswordTokenExpiry: {
        type: Sequelize.DATE
      },
      verificationToken: {
        type: Sequelize.STRING
      },
      verificationTokenExpiry: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};