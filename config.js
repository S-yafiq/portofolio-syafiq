const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('perpustakaan', 'postgres', 'syafiqardi30', {
	host: 'localhost',
	dialect: 'postgres',
	logging: false
});

module.exports = sequelize