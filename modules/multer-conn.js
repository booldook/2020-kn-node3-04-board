const fs = require('fs');
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, makeFolder());
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({storage});

function makeFolder() {
	const folderName = moment().format("YYMMDD"); //200531
	const newPath = path.join(__dirname, "../upload/"+folderName);
	if(!fs.existsSync(newPath)) {
		fs.mkdir(newPath, (err) => {
			if(err) next(err);
			return newPath;
		});
	}
	return newPath;
}

module.exports = upload;