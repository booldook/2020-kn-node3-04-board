const express = require('express');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const { pool } = require('../modules/mysql-conn');
const { alert } = require('../modules/util');

router.get(['', '/list'], async (req, res, next) => {
	let pugVals = {cssFile: "board", jsFile: "board"};
	let sql = "SELECT * FROM board ORDER BY id DESC";
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql);
		connect.release();
		let lists = result[0].map((v) => {
			v.created = moment(v.created).format('YYYY-MM-DD');
			return v ;
		});
		pugVals.lists = lists;
		res.render("board/list.pug", pugVals);
	}
	catch (e) {
		connect.release();
		next(e);
	}
})

router.get('/write', (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	res.render("board/write.pug", pugVals);
})

router.post('/save', async (req, res, next) => {
	let { title, writer, comment, created = moment().format('YYYY-MM-DD HH:mm:ss') } = req.body;
	let values = [title, writer, comment, created];
	let sql = "INSERT INTO board SET title=?, writer=?, comment=?, created=?";
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql, values);
		connect.release();
		if(result[0].affectedRows > 0) res.send(alert('저장되었습니다', '/board'));
		else res.send(alert('에러가 발생하였습니다.', '/board'));
	}
	catch(e) {
		connect.release();
		next(e);
	}
})

module.exports = router;