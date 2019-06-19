const keystone = require('keystone');
const ChecklistModel = keystone.list('Checklist').model;

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'checklist';
	locals.filters = {
		post: req.params.checklist,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {
		const q = ChecklistModel.findOne({
			state: 'published',
			slug: locals.filters.post,
		})
		.populate('author categories resources tags items')
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
				locals.data.post = result.toObject();
			}
			next(err);
		});
	});

	// Render the view
	view.render('checklist');
};
