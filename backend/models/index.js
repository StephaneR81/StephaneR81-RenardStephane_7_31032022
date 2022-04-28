const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');
let sequelize;

try {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
  });
  console.log('Successfully connected to the database');
} catch (error) {
  console.error('Unable to connect to the database : ', error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.pictures = require('./picture.model.js')(sequelize, Sequelize);
db.comments = require('./comment.model.js')(sequelize, Sequelize);

db.users.hasMany(db.comments);
db.users.hasMany(db.pictures);
db.pictures.hasMany(db.comments);

module.exports = db;