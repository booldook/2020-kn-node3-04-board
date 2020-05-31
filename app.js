const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');
const { alert } = require('./modules/util.js');
require('dotenv').config();

/* Server */
app.listen(process.env.PORT, () => {
	console.log("http://127.0.0.1:"+process.env.PORT);
});

/* Setting */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/storage', express.static(path.join(__dirname, './upload')));

/* Router */
const boardRouter = require('./routes/board');
app.use('/board', boardRouter);


/* 예외처리 */
app.use((req, res, next) => {
	next(createError(404));
})

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	if(err.message == "File too large") {
		res.send(alert("업로드 용량을 초과하였습니다.", "/board/list"));
	}
	else {
		res.locals.status = (err.status || 500) + " error";
		res.render('error.pug');
	}
})