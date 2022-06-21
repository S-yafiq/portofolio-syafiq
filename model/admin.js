const { DataTypes } = require('sequelize');
let koneksi = require('../config')

const admin = koneksi.define('admin', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	email: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
	status: {
		type: DataTypes.STRING
	}
})

admin.sync({alter: true})

module.exports = admin