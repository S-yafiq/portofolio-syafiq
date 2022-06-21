const { DataTypes } = require('sequelize');
let koneksi = require('../config')

const kategori = koneksi.define('kategori', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	nama_kategori: {
		type: DataTypes.STRING,
	}
})

kategori.sync({alter: true})

module.exports = kategori