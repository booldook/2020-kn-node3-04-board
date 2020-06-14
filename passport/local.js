const LocalStrategy = require('passport-local').Strategy;

const cb = () => {

};

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameFiled: 'userid',
		passwordField: 'userpw'
	}), cb);
}