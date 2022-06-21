let bcrypt = require('bcrypt')
class Helper{
	static password(password, cb){
		bcrypt.hash(password, 10, (err, hash)=>{
			if(err){
				cb(err, null)
			}else{
				cb(null, hash)
			}
		})
	}
	static comparePassword(password, hashPassword, cb){
		bcrypt.compare(password, hashPassword, (err, result)=>{
			if(err){
				cb(err, null)
			}else{
				cb(null, result)
				// console.log(result);
			}
		})
	}
}

module.exports = Helper