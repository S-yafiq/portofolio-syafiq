var jwt = require('jsonwebtoken')
// let model = require('../model/user')

class HelperJWT{
	static makeToken(id, email, status, cb){
		// console.log(id);
		// console.log(status);
		var token = jwt.sign({id, email, status}, 'secret');
		cb(token)
	}
	static verifyTokenAdmin(req, res, next){
		// console.log(req.headers.token);
		jwt.verify(req.headers.token, 'secret', (err, decode)=>{
			// console.log(decode, "datta");
			// console.log(err,'<<<');
			if(err){
				// console.log(err);
				// res.json(err)
				res.json({pesan: 'Token id tidak sama'})
			}else{
				// console.log(decode);
				if(decode.status == `admin`){
					req.id = decode.id;
					next()
				}else{
					res.json({message: `dilarang mengakses halaman ini!.`})
				}
			}
		})
	}

	static verifyTokenAnggota(req, res, next){
		// console.log(req.headers.token);
		jwt.verify(req.headers.token, 'secret', (err, decode)=>{
			// console.log(decode, "datta");
			// console.log(err,'<<<');
			if(err){
				// console.log(err);
				// res.json(err)
				res.json({pesan: 'Token id tidak sama'})
			}else{
					req.id = decode.id;
					next()
			}
		})
	}
}
module.exports = HelperJWT