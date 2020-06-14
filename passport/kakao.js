const KakaoStratege = require('passport-kakao').Strategy;

const cb = () => {

}

module.exports = (passport) => {
	passport.use(new KakaoStratege({
		clientID : procee.env.KAKAO_KEY,
    callbackURL : '/'
	}), cb);
}