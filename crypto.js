const crypto = require('crypto');
const bcrypt = require('bcrypt');
let salt = 'My PassWord!@#$';
let password = '1122334455';
//const sha512 = crypto.createHash('sha512').update(password + salt).digest('base64');
const pass = async () => {
	const hash = await bcrypt.hash(password + salt, 8);
	console.log(hash);
	const compare = await bcrypt.compare(password + salt, hash);
	console.log(compare);
}
pass();