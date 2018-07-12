const keystone = require('keystone');
const Strategy = require('passport-wsfed-saml2/lib/passport-wsfed-saml2/index').Strategy;
const UserModel = keystone.list('User').model;

const options = {
	path: process.env.CALLBACK_URL,
	realm: process.env.REALM,
	identityProviderUrl: process.env.PROVIDER_URL,
	cert: process.env.CERTIFICATE,
};

const auth = new Strategy(options, (profile, done) => {
	const { email } = profile;
	const User = new UserModel({
		email,
		name: 'Admin',
		isAdmin: true,
	});

	if (!email) return done(new Error('Email not found'), null);

	process.nextTick(() => {
		UserModel.findOne({ email }, (err, user) => {
			if (err) return done(err);

			if (!user) {
				User.save((err, user) => {
					if (err) return done(err);
					return done(null, user);
				});
			}

			return done(null, user);
		});
	});
});

exports = module.exports = auth;
