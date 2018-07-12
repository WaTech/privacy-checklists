const keystone = require('keystone');
const random = require('../../utils/random');
const QuoteModel = keystone.list('Quote').model;


exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.data = {
		testimonials: [],
		checklists: [],
		quotes: [],
		posts: [],
	};

	// Load the posts
	view.on('init', function (next) {

		const q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 2,
			maxPages: 2,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Load the checklists
	view.on('init', function (next) {

		const q = keystone.list('Checklist').paginate({
			page: req.query.page || 1,
			perPage: 8,
			maxPages: 5,
			filters: {
				state: 'published',
			},
		})
			.sort('-createdAt')
			.populate('author tags');

		q.exec(function (err, results) {
			locals.data.checklists = results;
			next(err);
		});
	});

	view.on('init', function (next) {
		QuoteModel.find({}).populate('targetChecklist').exec(function (err, result) {
			const index = random(result.length);
			locals.data.quotes = result[index];
			next(err);
		});
	});

	// Load the testimonials
	view.on('init', function (next) {

		const q = keystone.list('Testimonial').paginate({
			page: req.query.page || 1,
			perPage: 1,
			maxPages: 1,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate');

		q.exec(function (err, results) {
			locals.data.testimonials = results;
			next(err);
		});
	});

	// Render the view
	view.render('index');
};
