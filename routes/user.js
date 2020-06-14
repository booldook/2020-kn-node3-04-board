const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isGuest, isUser } = require('../modules/auth-conn');
const { alert } = require('../modules/util'); 
const { pool } = require('../modules/mysql-conn');
const pugVals = {cssFile: "user", jsFile: "user"};

router.get('/login', isGuest, (req, res, next) => {
	res.render('user/login.pug', pugVals);
});

router.get('/logout', isUser, (req, res, next) => {
	req.session.destroy();
	req.app.locals.user = null;
	res.send(alert("로그아웃 되었습니다.", "/"));
});

router.get('/join', isGuest,(req, res, next) => {
	res.render('user/join.pug', pugVals);
});

router.post('/save', isGuest, async (req, res, next) => {
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
		res.send(alert("회원가입이 완료되었습니다.", "/"));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

router.post('/auth', isGuest, async (req, res, next) => {
	let {userid, userpw} = req.body;
	let sql, connect, result;
	try {
		if(userid && userpw) {
			connect = await pool.getConnection();
			sql = "SELECT * FROM user WHERE userid=?";
			result = await connect.query(sql, [userid]);
			if(result[0][0]) {
				const compare = await bcrypt.compare(userpw + process.env.PASS_SALT, result[0][0].userpw);
				connect.release();
				if(compare) {
					req.session.user = {}
					req.session.user.id = result[0][0].id;
					req.session.user.userid = result[0][0].userid;
					req.session.user.username = result[0][0].username;
					req.session.user.email = result[0][0].email;
					req.session.user.grant = result[0][0].grant;
					res.send(alert("회원입니다. 반갑습니다.", '/board'));
				}
				else res.send(alert('아이디와 패스워드를 확인하세요.', '/'));
			}
			else {
				connect.release();
				res.send(alert('아이디와 패스워드를 확인하세요.', '/'));
			}
		}
		else res.send(alert('아이디와 패스워드를 확인하세요.', '/'));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

module.exports = router;