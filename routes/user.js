const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isGuest, isUser } = require('../modules/auth-conn');
const { alert } = require('../modules/util'); 
const { pool } = require('../modules/mysql-conn');
const passport = require('passport');
const pugVals = {cssFile: "user", jsFile: "user"};

router.get('/login', isGuest, (req, res, next) => {
	res.render('user/login.pug', pugVals);
});

router.get('/logout', isUser, (req, res, next) => {
	// req.session.destroy();
	req.logout();
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

router.post('/auth', async (req, res, next) => {
	const done = (err, user, msg) => {
		if(err) return next(err);
		if(!user) return res.send(alert(msg, "/"));
		else {
			req.login(user, (err) => {
				if(err) return next(err);
				else return res.send(alert("로그인 되었습니다.", "/board"));
			});
		}
	}
	passport.authenticate('local', done)(req, res, next);
	
});

router.get("/kakao", passport.authenticate('kakao'));
router.get("/kakao/cb", passport.authenticate('kakao', {failureRedirect: "/"}), (req, res, next) => {
	console.log(req.user);
	req.login(req.user, (err) => {
		if(err) next(err);
		else res.redirect("/board");
	});
});

module.exports = router;