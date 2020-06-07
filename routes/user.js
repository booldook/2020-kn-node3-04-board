const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../modules/mysql-conn');
const pugVals = {cssFile: "user", jsFile: "user"};

router.get('/login', (req, res, next) => {
	res.render('user/login.pug', pugVals);
});

router.get('/logout', (req, res, next) => {

});

router.get('/join', (req, res, next) => {
	res.render('user/join.pug', pugVals);
});

router.post('/save', async (req, res, next) => {
	let {userid, userpw, username, email} = req.body;
	userpw = await bcrypt.hash(userpw + process.env.PASS_SALT, Number(process.env.PASS_ROUND));
	let connect, sql, result, sqlVals; 
	try {
		connect = await pool.getConnection();
		sql = "INSERT INTO user SET userid=?, userpw=?, username=?, email=?";
		sqlVals = [userid, userpw, username, email];
		result = await connect.query(sql, sqlVals);
		console.log(result);
		connect.release();
		res.redirect("/");
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

module.exports = router;