const express = require('express');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const { pool } = require('../modules/mysql-conn');
const { alert } = require('../modules/util');

router.get(['', '/list'], (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	res.render("board/list.pug", pugVals);
})

router.get('/write', (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	res.render("board/write.pug", pugVals);
})

router.post('/save', async (req, res, next) => {
	const { title, writer, comment, created = moment().format('YYYY-MM-DD HH:mm:ss') } = req.body;
	const values = [title, writer, comment, created];
	const sql = "INSERT INTO board SET title=?, writer=?, comment=?, created=?";
	const connect = await pool.getConnection();
	const result = await connect.query(sql, values);
	connect.release();
	if(result[0].affectedRows > 0) res.send(alert('저장되었습니다', '/board'));
	else res.send(alert('에러가 발생하였습니다.', '/board'));
})

module.exports = router;