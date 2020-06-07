const express = require('express');
const router = express.Router();
const pugVals = {cssFile: "user", jsFile: "user"};

router.get('/login', (req, res, next) => {
	res.render('user/login.pug', pugVals);
});

router.get('/logout', (req, res, next) => {

});

router.get('/join', (req, res, next) => {
	res.render('user/join.pug', pugVals);
});

module.exports = router;