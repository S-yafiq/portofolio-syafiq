const { DataTypes } = require('sequelize');
let koneksi = require('../config')

const anggota = koneksi.define('anggota', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	nama: {
		type: DataTypes.STRING,
	},
	alamat: {
		type: DataTypes.STRING,
	},
	no_handphone: {
		type: DataTypes.INTEGER,
	},
	email: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING
	},
	status: {
		type: DataTypes.STRING
	}
})

anggota.sync({alter: true})

module.exports = anggota