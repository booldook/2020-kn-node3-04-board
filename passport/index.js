const local = require('./local');
const kakao = require('./kakao');

module.exports = (passport) => {

	local(passport);
	kakao(passport);
}