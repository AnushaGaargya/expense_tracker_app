const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fullname: {type:Sequelize.STRING,
            allowNull: false
    },
    phone: {type: Sequelize.STRING,
            allowNull: false
    },
    username: {type: Sequelize.STRING,
              allowNull: false,
              unique: true},
    email: {type: Sequelize.STRING,
            allowNull: false,
            unique: true},
    password: {type: Sequelize.STRING,
                allowNull: false}
});
module.exports = User;