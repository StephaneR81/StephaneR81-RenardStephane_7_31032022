//Imports
const db = require('../models');

module.exports = (sequelize, Sequelize) => {
    const Picture = sequelize.define('picture', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            isAlphanumeric: true,
            notEmpty: true
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            isUrl: true,
            notEmpty: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            references: db.users,
            referencesKey: 'id'
        }
    });
    return Picture;
};