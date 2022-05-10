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
                isAlphanumeric: {
                    args: true,
                    msg: "Le nom ne peut comporter que des lettres non accentuées et des chiffres"
                },
                notEmpty: {
                    args: true,
                    msg: "Le nom est requis"
                },
                len: {
                    args: [3, 20],
                    msg: "Le nom doit être compris entre 3 et 20 caractères"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: "L'adresse E-mail est déjà utilisée"
            },
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "L'adresse E-mail est incorrecte"
                },
                notEmpty: {
                    args: true,
                    msg: "L'adresse E-mail est requise"
                },
                len: {
                    args: [8, 30],
                    msg: "L'E-mail doit être compris entre 6 et 30 caractères"
                }

            }
        },
        password: {
            //password length defined at 100 characters keeping in mind that the hash would be over 20 characters
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Le mot de passe est requis (8 à 20 caractères)"
                },
                len: {
                    args: [8, 100],
                    msg: "Le mot de passe doit être compris entre 8 et 20 caractères"
                }

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