module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true,
                notEmpty: true,
                len: [3, 20]
            }
        },
        email: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: 'Email address already in use !'
            },
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true,
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [8, 100]
            }
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultvalue: false,
            validate: {
                notEmpty: true
            }
        }
    });
    return User;
};