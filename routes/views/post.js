const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {

		const q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		})
		.populate('author categories')
		.populate([
			{
				path: 'related.posts',
				populate: {
					path: 'categories',
				},
			},
			{
				path: 'related.checklists',
				populate: {
					path: 'tags',
				},
			},
		]);

		q.exec(function (err, result) {
			if (result) {
				locals.data.post = result;
			}
			next(err);
		});

	});

	// Render the view
	view.render('post');
};
