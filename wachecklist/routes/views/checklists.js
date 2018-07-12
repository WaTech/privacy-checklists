const keystone = require('keystone');
const random = require('../../utils/random');
const sortByTags = require('../../utils/sortByTags');
const ChecklistModel = keystone.list('Checklist').model;
const QuoteModel = keystone.list('Quote').model;
const TagModel = keystone.list('Tag').model;


exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	const { tags } = req.params;
	let query = '';

	if (tags) {
		query = new RegExp(`.*${tags.trim().replace(/[<>*(+)?]/g, '\\$&')}.*`, 'i');
	}

	// Init locals
	locals.section = 'checklists';
	locals.tag = tags || 'all';
	locals.filters = { tags };
	locals.data = {
		posts: [],
		quotes: [],
	};

	// Load the current tag filter
	view.on('init', function (next) {
		if (tags) {
			TagModel.findOne({ key: locals.filters.tags }).exec(function (err, result) {
				locals.data.tags = result;
				next(err);
			});
		} else {
			next();
		}
	});

	view.on('init', function (next) {
		QuoteModel.find({}).populate('targetChecklist').exec(function (err, result) {
			const index = random(result.length);
			locals.data.quotes = result[index];
			next(err);
		});
	});

	// Load the checklists
	view.on('init', function (next) {

		const q = ChecklistModel
			.find({ state: 'published' })
			.sort('-createdAt')
			.populate('author tags');

		if (locals.data.tags) {
			q.where('tags').in([locals.data.tags]);
		}

		q.exec(function (err, results) {
			if (tags) {
				locals.data.posts = sortByTags(results, query);
			} else {
				locals.data.posts = results;
			}
			next(err);
		});
	});

	// Render the view
	view.render('checklists');
};
