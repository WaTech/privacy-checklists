const keystone = require('keystone');

function logout (req, res) {
	keystone.session.signout(req, res, () => {
		req.logout();
		res.redirect('/');
	});
}

exports = module.exports = logout;
