// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const handlebars = require('express-handlebars');
const Helpers = require('./templates/views/helpers');
const LessAutoprefix = require('less-plugin-autoprefix');
const pkg = require('./package');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'wachecklist',
	'brand': 'wachecklist',

	'less': 'public',
	'less options': {
		render: {
			plugins: [autoprefix],
		},
	},
	'static': 'public',
	'favicon': false,
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new Helpers(),
		extname: '.hbs',
	}).engine,

	'view cache': true,
	'compress': true,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'admin path': 'admin',

	'mongo': process.env.MONGO_URI || `mongodb://localhost:27017/${pkg.name}`,

	'wysiwyg cloudinary images': true,
	'wysiwyg additional buttons': 'formatselect blockquote',
	'wysiwyg additional options': {
		external_plugins: {
			uploadimage: '/js/uploadimage/plugin.min.js',
		},
	},
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	pages: ['pages', 'sections'],
	posts: ['posts', 'post-categories', 'testimonials'],
	checklists: ['checklists', 'checklist-items', 'tags', 'resources'],
	quotes: ['quotes'],
	galleries: 'galleries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
