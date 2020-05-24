const express = require('express');
const path = require('path');
const router = express.Router();
const moment = require('moment');
const { pool } = require('../modules/mysql-conn');
const { alert } = require('../modules/util');
const pager = require('../modules/pager');

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	let page = req.params.page ? Number(req.params.page) : 1;
	let pugVals = {cssFile: "board", jsFile: "board"};
	let connect, result, sql, total;
	try {
		connect = await pool.getConnection();
		sql = "SELECT count(id) FROM board";
		result = await connect.query(sql);
		total = result[0][0]['count(id)'];
		pagerValues = pager({page, total, list: 3, grp: 3});
		connect.release();
		res.json(pagerValues);
		/*
		sql = "SELECT * FROM board ORDER BY id DESC LIMIT ?, ?";
		result = await connect.query(sql, [pagerValues.stIdx, pagerValues.list]);
		let lists = result[0].map((v) => {
			v.created = moment(v.created).format('YYYY-MM-DD');
			return v ;
		});
		pugVals.lists = lists;
		res.render("board/list.pug", pugVals);
		*/
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

router.get('/view/:id', async (req, res, next) => {
	let id = req.params.id;
	let pugVals = {cssFile: "board", jsFile: "board"};
	let sql = "SELECT * FROM board WHERE id=?";
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql, [id]);
		connect.release();
		pugVals.data = result[0][0];
		pugVals.data.created = moment(pugVals.data.created).format('YYYY-MM-DD HH:mm:ss');
		res.render('board/view.pug', pugVals);
	}
	catch (e) {
		connect.release();
		next(e);
	}
})

router.get('/remove/:id', async (req, res, next) => {
	let id = req.params.id;
	let sql = "DELETE FROM board WHERE id=?";
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql, [id]);
		connect.release();
		if(result[0].affectedRows == 1) res.send(alert("삭제되었습니다.", "/board"));
		else res.send(alert("삭제가 실행되지 않았습니다. 관리자에게 문의하세요.", "/board"));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

module.exports = router;