const keystone = require('keystone');

function login (req, res) {
	const { user } = req;
	const onSuccess = user => res.redirect('/admin');
	const onFail = err => res.redirect('/');

	if (!user) {
		throw new Error('User not found.');
	}

	keystone.session.signinWithUser(user, req, res, onSuccess, onFail);
}

exports = module.exports = login;
