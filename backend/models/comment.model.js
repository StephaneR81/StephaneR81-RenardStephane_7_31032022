const db = require("../models");

module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Veuillez saisir un commentaire'
                },
                len: {
                    args: [6, 500],
                    msg: 'Le commentaire doit être compris entre 6 et 500 caractères'
                }
            }
        },
        pictureId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            isInt: true,
            references: db.pictures,
            referencesKey: 'id'
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            notEmpty: true,
            isInt: true,
            references: db.users,
            referencesKey: 'id'
        }
    });
    return Comment;
};