const { DataTypes } = require('sequelize');
let koneksi = require('../config')
const peminjaman = require('./peminjaman')
const buku = require('./buku')
const anggota = require('../model/anggota')

const pengembalian = koneksi.define('pengembalian', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	tangggal_pengembalian: {
		type: DataTypes.DATE
	},
	jumlah_kembali: {
		type: DataTypes.INTEGER
	}
},{
	freezeTableName: true,
	timestamps: false
})


peminjaman.hasMany(pengembalian)
pengembalian.belongsTo(peminjaman)
buku.hasMany(pengembalian)
pengembalian.belongsTo(buku)
anggota.hasMany(pengembalian)
pengembalian.belongsTo(anggota)


pengembalian.sync({alter: true})

module.exports = pengembalian