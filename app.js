const express = require('express');
const app = express();
const path = require('path');
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

/* Router */
const boardRouter = require('./routes/board');
app.use('/board', boardRouter);