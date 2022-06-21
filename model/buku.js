const { DataTypes, INTEGER } = require('sequelize');
let koneksi = require('../config');
const kategori = require('./kategori')

const buku = koneksi.define('buku', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	judul: {
		type: DataTypes.STRING,
	},
	penulis: {
		type: DataTypes.STRING,
	},
	tahun_terbit: {
		type: DataTypes.INTEGER
	},
	stock: {
		type: DataTypes.INTEGER
	},
	penerbit: {
		type: DataTypes.STRING,
	},
})


kategori.hasMany(buku)
buku.belongsTo(kategori)

buku.sync({alter: true})

module.exports = buku