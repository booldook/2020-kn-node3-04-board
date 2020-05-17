const express = require('express');
const path = require('path');
const router = express.Router();
const { pool } = require('../modules/mysql-conn');

router.get(['', '/list'], (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	res.render("board/list.pug", pugVals);
})

router.get('/write', (req, res, next) => {
	const pugVals = {cssFile: "board", jsFile: "board"};
	res.render("board/write.pug", pugVals);
})

router.post('/save', (req, res, next) => {
	
})

module.exports = router;