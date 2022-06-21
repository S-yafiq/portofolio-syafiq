const admin = require('../model/admin')
const anggota = require('../model/anggota')
const buku = require('../model/buku')
const kategori = require('../model/kategori')
const jwt = require('../helper/jwt')
const bcrypt = require('../helper/bcrypt')
const { Op, Model, where } = require('sequelize')
const { hash } = require('bcrypt')
const Queue = require('bull')
const peminjaman = require('../model/peminjaman')
const pengembalian = require('../model/pengembalian')

class Controller{
	static adminRegister(req, res){
		let email = req.body.email
		let password = req.body.password
		let status = req.body.status
		bcrypt.password(password, async (err, password)=>{
			try{
				await admin.create({email, password, status}).then(data=>{
					res.status(200).json({pesan: 'Sign up admin succes!'})
				}).catch(err=>{
					res.status(500).json({pesan: 'Sign up admin falied!'})
				})
			}catch{
				res.status(500).json({pesan: 'Error'})
			}
		})
		
	}
	static adminLogin(req, res){
		let email = req.body.email
		let password = req.body.password
		let status = req.body.status
		admin.findAll({
			where: {
				email: email
			}
		}).then(data=>{ 
			// console.log(data);
			// res.send(data)
			let hashPassword = ''
			let email = ''
			let id = ''
			let status = data[0].status
			// console.log(status);
			for(let i = 0; i < data.length; i++){
				hashPassword += data[i].dataValues.password
				email += data[i].dataValues.email
				id += data[i].dataValues.id
			}
			if(data.length > 0){
				bcrypt.comparePassword(password, hashPassword, (err, hasil)=>{
					if(hasil){
						jwt.makeToken(id, email, status, (token)=>{
							res.status(200).json({pesan: 'Sign in admin succes', token: token})
						})
					}else{
						res.status(500).json({pesan: 'Sign in Failed'})
					}
				})
			}else{
				res.status(500).json({pesan: 'Email not register'})
			}
			// console.log(data);
		}).catch(err =>{
			res.sendStatus(403)
		})
	}
	static anggotaRegister(req, res){
		let nama = req.body.nama
		let alamat = req.body.alamat
		let no_handphone = parseInt(req.body.no_handphone)
		// console.log(no_handphone);
		let email = req.body.email
		let password = req.body.password
		let status = req.body.status
		bcrypt.password(password, (err, password)=>{
			anggota.create({nama: nama, alamat: alamat, no_handphone: no_handphone, email: email, password: password, status: status}).then(data=>{
				res.status(200).json({pesan: 'Sign up anggota succes!'})
			}).catch(err=>{
				res.status(500).json({pesan: err.message})
			})		
		})
	}
	static anggotaLogin(req, res){
		let nama = req.body.nama
		let alamat = req.body.alamat
		let no_handphone = req.body.no_handphone
		let email = req.body.email
		let password = req.body.password
		let status = req.body.status
		anggota.findAll({
			where: {
				// password: password
				email: email
			}
		}).then(data=>{
			let id = data[0].id
			let form = req.body.password
			let password = data[0].password
			// console.log(password);
			if(data.length > 0){
				bcrypt.comparePassword(form, password, (err, hasil) => {
					// console.log(hasil);
					if(hasil){
						jwt.makeToken(id, email, status, (hasilToken)=>{
							res.status(200).json({msg: 'Sign In Anggota Succes!', token: hasilToken})
						})
					}else{
						res.status(500).json({msg: 'Sign in Anggota Failed!'})
					}
				})
			}else{
				res.status(500).json({msg: 'Email is not register'})
			}
			// res.status(200).json({pesan: 'Sign in anggota succes'})
		}).catch(err=>{
			res.send({pesan: err.message})
		})
	}
	static addBuku(req, res){
		let judul = req.body.judul
		let penulis = req.body.penulis
		let tahunTerbit = req.body.tahun
		let stock = req.body.stock
		let penerbit = req.body.penerbit
		let kategori = req.body.kategori
		buku.create({judul: judul, penulis: penulis, tahun_terbit: tahunTerbit, stock: stock, penerbit: penerbit, kategoriId: kategori}).then(data=>{
			res.send(data)
		}).catch(err => {
			res.json({message: err.message})
		})
	}
	static deleteBuku(req, res){
		let id = req.body.id
		// console.log(id);
		buku.destroy({
			where: {
				id: id
			}
		}).then(data=>{
			res.status(200).json({message: 'Delete buku succes'})
		}).catch(err=>{
			res.json(500).json({message: 'Delete buku failed'})
		})
	}
	static addKategori(req, res){
		let nama_kategori = req.body.kategori
		kategori.create({nama_kategori}).then(data=>{
			res.status(200).json({pesan: 'Add kategori succes!'})
		}).catch(err=>{
			res.status(500).json({pesan: err.message})
		})
	}
	static getBuku(req, res){
		buku.findAll().then(data=>{
			res.send({data: data})
		}).catch(err=>{
			res.send({err: err.message})
		})
	}
	static all(req, res){
		peminjaman.findAll().then(data=>{
			res.status(200).json({message: 'Succes', data: data})
		}).catch(err=>{
			res.status(500).json({err: err.message})
		})
	}
	static pengembalian(req, res){
		let tanggal_pengembalian = new Date()
		let anggotaId = req.id
		let bukuId = req.body.bukuId
		let peminjamanId = req.body.peminjamanId
		let jmlKembalian = req.body.jmlKembali
		peminjaman.findAll({where: {id: peminjamanId}})
		.then(dataPinjam=>{
			// console.log(dataPinjam);
			let jmlPinjam = dataPinjam[0].jumlah_pinjam
			if(jmlKembalian > jmlPinjam){
				res.json({message: 'Buku yang anda kembalikan terlalu banyak'})
			}else if(dataPinjam[0].length == 0){
				res.json({message: 'Anda tidak meminjam buku ini'})
			}else{
				pengembalian.findAll({where: {bukuId: bukuId}})
				.then(dataKembali=>{
					if(dataKembali.length > 0){
						let hasil = jmlPinjam - jmlKembalian;
						peminjaman.update({jumlah_pinjam: hasil}, {
							where: {
								id: peminjamanId
							}
						}).then(data =>{
							let hasil = dataKembali[0].jumlah_kembali + parseInt(jmlKembalian)
							pengembalian.update({jumlah_kembali: hasil}, {
								where: {
									bukuId: bukuId
								}
							}).then(data => res.json({message: `berhasil mengembalikan buku`}))
							.catch(err => res.json({message: err.message}))
						}).catch(err=> res.json({message: err.message}))
						
					}else{
						// console.log(dataKembali);
						let hasil = jmlPinjam - jmlKembalian
						peminjaman.update({jumlah_pinjam: hasil}, {
							where: {
								id: peminjamanId
							}
						})
						.then(data=>{
							pengembalian.create({jumlah_kembali: jmlKembalian, tangggal_pengembalian: tanggal_pengembalian, anggotumId: anggotaId, bukuId: bukuId, peminjamanId: peminjamanId})
							.then(data =>{
								buku.findAll({where: {id: bukuId}})
								.then(dataBuku=>{
									// console.log(dataBuku[0]);
									// console.log(data.jumlah_kembali);
									let hasilStock = dataBuku[0].stock + data.jumlah_kembali
									// console.log(hasilStock);
									buku.update({stock: hasilStock},{where: {id: bukuId}})
									.then(data=>{
										// console.log(data);
										res.json({message: data})
									})
									.catch(err=>{
										res.json({message: err.message})
									})
								})
								.catch(err=>{
									res.json({message: err.message})
								})
							})
							.catch(err=>{
								res.json({message: err.message})
							})
						})
					}
				})
				.catch(err=>{
					res.status(500).json({message: err.message})
				})
			}
		})
	}
}

module.exports = Controller