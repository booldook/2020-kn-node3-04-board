const express = require('express');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const router = express.Router();
const moment = require('moment');
const { pool } = require('../modules/mysql-conn');
const { alert, imgExt } = require('../modules/util');
const { upload, serverPath, clientPath, imgSrc } = require('../modules/multer-conn');
const pager = require('../modules/pager');
const { isUser, isGuest, isGrant2 } = require('../modules/auth-conn');


router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	let page = req.params.page ? Number(req.params.page) : 1;
	req.app.locals.page = page;
	let pugVals = {cssFile: "board", jsFile: "board"};
	let connect, result, sql, total;
	try {
		connect = await pool.getConnection();
		sql = "SELECT count(id) FROM board";
		result = await connect.query(sql);
		total = result[0][0]['count(id)'];
		pagerVals = pager({page, total, list: 3, grp: 3});
		pugVals.pager = pagerVals;
		sql = "SELECT * FROM board ORDER BY id DESC LIMIT ?, ?";
		result = await connect.query(sql, [pagerVals.stIdx, pagerVals.list]);
		connect.release();
		let lists = result[0].map((v) => {
			v.created = moment(v.created).format('YYYY-MM-DD');
			if(v.savename) v.src = imgSrc(v.savename); 
			return v ;
		});
		pugVals.lists = lists;
		pugVals.user = req.session.user;
		res.render("board/list.pug", pugVals);
	}
	catch (e) {
		connect.release();
		next(e);
	}
})

router.get('/write', isUser, isGrant2, (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	pugVals.user = req.session.user;
	res.render("board/write.pug", pugVals);
});

router.get('/update/:id', isUser, async (req, res, next) => {
	let pugVals = {cssFile: "board", jsFile: "board"};
	let connect, sql, result, filePath;
	sql = "SELECT * FROM board WHERE id="+req.params.id;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql);
		connect.release();
		pugVals.list = result[0][0];
		if(pugVals.list.savename) {
			pugVals.list.savename = clientPath(pugVals.list.savename);
		}
		pugVals.user = req.session.user;
		res.render("board/write.pug", pugVals);
	}
	catch (e) {
		connect.release();
		next(e);
	}
});

router.post('/save', isUser, upload.single('upfile'), async (req, res, next) => {
	let { title, writer, comment, created = moment().format('YYYY-MM-DD HH:mm:ss') } = req.body;
	let values = [title, writer, comment, created];
	let sql = "INSERT INTO board SET title=?, writer=?, comment=?, created=?";
	if(req.file) {
		sql += ", oriname=?, savename=?";
		values.push(req.file.originalname);
		values.push(req.file.filename);
	}
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql, values);
		connect.release();
		if(result[0].affectedRows > 0) {
			if(req.fileChk) res.send(alert(req.fileChk + '은(는) 업로드 할 수 없습니다. 파일 이외의 내용은 저장되었습니다.', '/board'));
			else res.send(alert('저장되었습니다', '/board'));
		}
		else res.send(alert('에러가 발생하였습니다.', '/board'));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

router.post('/put', isUser, upload.single('upfile'), async (req, res, next) => {
	let { title, writer, comment, id } = req.body;
	let connect, result, sql, values;
	try {
		if(req.file) {
			let sql2 = "SELECT savename FROM board WHERE id="+id;
			connect = await pool.getConnection();
			result = await connect.query(sql2);
			if(result[0][0].savename) {
				await fsPromises.unlink(serverPath(result[0][0].savename))
			}
			sql = "UPDATE board SET title=?, writer=?, comment=?, oriname=?, savename=? WHERE id=?";
			values = [title, writer, comment, req.file.originalname, req.file.filename, id];
		}
		else {
			sql = "UPDATE board SET title=?, writer=?, comment=? WHERE id=?";
			values = [title, writer, comment, id];
		}
		connect = await pool.getConnection();
		result = await connect.query(sql, values);
		connect.release();
		if(result[0].affectedRows > 0) {
			if(req.app.locals.page)
				res.send(alert('수정되었습니다', '/board/list/'+req.app.locals.page));
			else
				res.send(alert('수정되었습니다', '/board/list/'));
		}
		else res.send(alert('에러가 발생하였습니다.', '/board'));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

router.get('/view/:id', isUser, async (req, res, next) => {
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
		if(pugVals.data.savename) pugVals.data.src = imgSrc(pugVals.data.savename);
		if(pugVals.data.savename) pugVals.data.file = pugVals.data.oriname; 
		pugVals.user = req.session.user;
		res.render('board/view.pug', pugVals);
	}
	catch (e) {
		connect.release();
		next(e);
	}
})

router.get('/remove/:id', isUser, async (req, res, next) => {
	let id = req.params.id;
	let sql, connect, result, filePath;
	try {
		connect = await pool.getConnection();
		sql = "SELECT savename FROM board WHERE id=?";
		result = await connect.query(sql, [id]);
		if(result[0][0].savename) {
			await fsPromises.unlink(serverPath(result[0][0].savename));
		}
		sql = "DELETE FROM board WHERE id=?";
		result = await connect.query(sql, [id]);
		connect.release();
		if(result[0].affectedRows == 1) res.send(alert("삭제되었습니다.", "/board/list/"+req.app.locals.page));
		else res.send(alert("삭제가 실행되지 않았습니다. 관리자에게 문의하세요.", "/board"));
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

router.get('/download/:id', isUser, async (req, res, next) => {
	const id = req.params.id;
	const sql = "SELECT * FROM board WHERE id=" + id;
	let connect, result;
	try {
		connect = await pool.getConnection();
		result = await connect.query(sql);
		connect.release();
		let realfile = path.join(__dirname, '../upload/', result[0][0].savename.substr(0, 6), result[0][0].savename);
		res.download(realfile, result[0][0].oriname);
	}
	catch(e) {
		connect.release();
		next(e);
	}
});

router.get('/rm-file/:id', isUser, async (req, res, next) => {
	let id = req.params.id;
	let sql, connect, result;
	try {
		sql = "SELECT savename FROM board WHERE id="+id;
		connect = await pool.getConnection();
		result = await connect.query(sql);
		if(result[0][0].savename) {
			await fsPromises.unlink(serverPath(result[0][0].savename))
			sql = "UPDATE board SET savename='', oriname='' WHERE id="+id;
			result = await connect.query(sql);
			connect.release(); 
			res.json({ code: 200 });
		}
		else res.json({ code: 521 });
	}
	catch(e) {
		connect.release();
		res.json({ code: 500 });
	}
});

module.exports = router;