'use strict';

const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category');
  },

  async down (queryInterface) {
    await queryInterface.dropTable('products', {
      category: {
        type: Sequelize.toString,
        allowNull: false
      }
    });
  }
};
