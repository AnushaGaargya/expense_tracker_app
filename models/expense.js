const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Expense = sequelize.define('expense',  {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category: {type:Sequelize.STRING,
            allowNull: false
    },
    description: {type: Sequelize.STRING,
            allowNull: false
    },
    amount: {type: Sequelize.FLOAT,
              allowNull: false
              }
    })

module.exports =Expense;