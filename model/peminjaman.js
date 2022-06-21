const { DataTypes } = require('sequelize');
let koneksi = require('../config')
const buku = require('./buku')
const anggota = require('./anggota')

const peminjaman = koneksi.define('peminjaman', 
{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}, 
	tanggal_peminjaman: {
		type: DataTypes.DATE,
	},
	jumlah_pinjam: {
		type: DataTypes.INTEGER
	}
},{
	freezeTableName: true,
	timestamps: false
})


buku.hasMany(peminjaman)
peminjaman.belongsTo(buku)
anggota.hasMany(peminjaman)
peminjaman.belongsTo(anggota)

peminjaman.sync({alter: true})

module.exports = peminjaman


