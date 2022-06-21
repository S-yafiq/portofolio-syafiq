const buku = require('../model/buku')
const peminjaman = require('../model/peminjaman')
const Queue = require('bull')
const jwt = require('../helper/jwt')

const addQueue = new Queue('addQueue', {
	redis: {
		host: '127.0.0.1',
		port: 6379,
		password: ''
	}
}); 
addQueue.process(async (job, done)=>{
	// console.log(job.data.bukuId);
	buku.findAll({where: {id : job.data.bukuId}})
	.then(dataBuku=>{
		// console.log(dataBuku);
		// res.json(dataBuku)
		// console.log(job.data.jumlah_pinjam);
		let judulBuku = dataBuku[0].judul
		if(dataBuku[0].stock > 0){
			peminjaman.findAll({where: {bukuId: job.data.bukuId}})
			.then(data=>{
				// console.log(data);
				if(data.length > 0){
				let jml = data[0].jumlah_pinjam
				let hasil = jml + job.data.jumlah_pinjam
				peminjaman.update({jumlah_pinjam: hasil}, {where: {id: data[0].id}})
				.then(data => {
					let hasil = dataBuku[0].stock - job.data.jumlah_pinjam
					buku.update({stock: hasil}, {where: {id: job.data.bukuId}})
					.then(data => {
						done(null, 'ya')
					})
					.catch(err => {
						done(null, err.message)
					})
				})
				.catch(err => {
					done(null, 'Gagal1')
				})
			}else{
				let bukuStock = dataBuku[0].stock
				peminjaman.create({tanggal_peminjaman: job.data.tanggal_peminjaman, bukuId: job.data.bukuId, anggotumId: job.data.anggotaId, jumlah_pinjam: job.data.jumlah_pinjam})
				.then(dataPinjam=>{
					let hasil = bukuStock - dataPinjam.jumlah_pinjam
					// console.log(dataPinjam);
					buku.update({stock: hasil}, {
						where: {
							id: job.data.bukuId	
						}
				})
					done(null, `Berhasil meminjam ${dataPinjam.jumlah_pinjam} buku, dengan judul ${judulBuku}`)						
				})
				.catch(err=>{
					done(null, `Gagal meminjam buku ${judulBuku}`)
				})
			}
			})
				.catch(err => {
					done(null, err.message)
				})
		}else{
			done(null, `Buku dengan judul ${judulBuku} stock habis`)
		}
	});
});
class Antrian{
		static async Antri(req, res){
			// let jml = parseInt(req.body.jml_pinjam)
			let tanggal_pinjam = new Date()
			let bukuId = req.body.bukuId
			let anggota = req.id
			let jumlah_pinjam = parseInt(req.body.jml_pinjam)
			// console.log(tanggal_pinjam);
			let job = await addQueue.add({
				tanggal_peminjaman: tanggal_pinjam,
				bukuId: bukuId,
				anggotaId: anggota,
				jumlah_pinjam: jumlah_pinjam
			})
			// console.log(job);
			// console.log(job);
			let finish = await job.finished()
			res.json({data: finish})
		}
}
	addQueue.on('completed', (job, result) => {
		console.log(`${result}`);
	})

module.exports = Antrian