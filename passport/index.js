const { pool } = require('../modules/mysql-conn');
const local = require('./local');
const kakao = require('./kakao');

module.exports = (passport) => {

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		let sql, connect, result, user;
		sql = "SELECT * FROM user WHERE id=?";
		try {
			connect = await pool.getConnection();
			result = await connect.query(sql, [id]);
			connect.release();
			user = result[0][0];
			done(null, user);
		}
		catch(e) {
			connect.release();
			done(e);
		}
	});

	local(passport);
	kakao(passport);
}