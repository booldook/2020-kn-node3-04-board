const fs = require('fs');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const { allowExt } = require('./util');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, makeFolder());
  },
  filename: function (req, file, cb) {
    cb(null, makeFile(file));
  }
});
const upload = multer({storage, fileFilter, limits: {fileSize: 2048000}});

function makeFile(file) {
	let oriName = file.originalname;	// abc.jpg
	let ext = path.extname(oriName);	// .jpg
	//200531-1523293823459-234.jpg
	let newName = moment().format('YYMMDD') + '-' + Date.now() + '-' + Math.floor((Math.random() * 900 + 100)) + ext;
	return newName;
};

function makeFolder() {
	const folderName = moment().format("YYMMDD"); //200531
	const newPath = path.join(__dirname, "../upload/"+folderName);
	if(!fs.existsSync(newPath)) {
		fs.mkdir(newPath, (err) => {
			if(err) new Error(err);
			return newPath;
		});
	}
	return newPath;
}

function fileFilter(req, file, cb) {
	const ext = path.extname(file.originalname).toLowerCase();
	if(allowExt.indexOf(ext) > -1) {
		cb(null, true);
	}
	else {
		req.fileChk = ext.substr(1);
		cb(null, false);
	}
}

module.exports = upload;