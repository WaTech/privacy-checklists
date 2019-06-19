/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');
const keystone = require('keystone');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Get Started', key: 'get-started', href: '/get-started' },
		{ label: 'All Checklists', key: 'checklists', href: '/checklists' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Disclaimer', key: 'disclaimer', href: '/disclaimer' },
	];
	res.locals.user = req.user;
	next();
};

exports.initLocalsSecondary = function (req, res, next) {
	res.locals.navLinksSecondary = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Get Started', key: 'get-started', href: '/get-started' },
		{ label: 'All Checklists', key: 'checklists', href: '/checklists' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect(`/admin/signin?from=${req.path}`);
	} else {
		next();
	}
};

exports.initPage = function (req, res, next) {
	const { path } = req;
	const pageModel = keystone.list('Page').model;
	let currentPage = path.slice(1).split('/')[0];

	if (currentPage === '') {
		currentPage = 'home';
	}

	pageModel.findOne({ slug: currentPage }).populate('sections').exec(function (err, page) {
		if (!err) {
			res.locals.page = page;
		}

		next(err);
	});
};

exports.signinRoute = function (req, res, next) {
	if (/^\/admin\/signin\/?$/.test(req.path)) {
		res.redirect('/login');
	}
	next();
};
